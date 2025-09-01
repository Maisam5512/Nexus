const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const { createServer } = require("http")
const { Server } = require("socket.io")
const crypto = require("crypto")
const { encryptMessage, decryptMessage } = require('./utils/encryption');
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const profileRoutes = require("./routes/profiles")
const messageRoutes = require("./routes/messages")
const collaborationRoutes = require("./routes/collaborations")

// Import middleware
const { authenticateToken } = require("./middleware/auth")
const errorHandler = require("./middleware/errorHandler")

// Import models
const Message = require("./models/Message")
const User = require("./models/User")

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
})

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Store online users
const onlineUsers = new Map()

// Encryption key (in production, use a secure key management system)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');



// Socket.io for real-time features
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (token) {
    // Verify JWT token for socket connection
    const jwt = require("jsonwebtoken")
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.userId
      next()
    } catch (err) {
      next(new Error("Authentication error"))
    }
  } else {
    next(new Error("Authentication error"))
  }
})

io.on("connection", (socket) => {
  console.log(`User ${socket.userId} connected`)
  
  // Add user to online users
  onlineUsers.set(socket.userId, socket.id)
  
  // Update user's online status in DB
  User.findByIdAndUpdate(socket.userId, { isOnline: true }, (err) => {
    if (err) console.error("Error updating online status:", err)
  })

  // Broadcast online status to all users
  io.emit("user_online", { userId: socket.userId })

  // Join user to their personal room
  socket.join(socket.userId)

  // Handle sending messages
  socket.on("send_message", async (data) => {
    try {
      const { receiverId, content, messageType = "text", replyTo } = data
      const senderId = socket.userId

      // Ensure receiver exists
      const receiver = await User.findById(receiverId)
      if (!receiver) {
        socket.emit("error", { message: "Receiver not found" })
        return
      }

      // Generate conversationId
      const conversationId = Message.generateConversationId(senderId, receiverId)

      // Encrypt message content
      const encryptedContent = encryptMessage(content)

      // Create and save message
      const message = new Message({
        senderId,
        receiverId,
        content: encryptedContent, // Store encrypted content
        messageType,
        conversationId,
        replyTo,
      })

      await message.save()
      
      // Populate the message with user details
      await message.populate("senderId", "name avatarUrl")
      await message.populate("receiverId", "name avatarUrl")
      if (replyTo) {
        await message.populate("replyTo")
      }

      // Decrypt message for real-time delivery
      const messageForDelivery = message.toObject();
      messageForDelivery.content = content; // Send decrypted content for real-time

      // Emit to receiver
      socket.to(receiverId).emit("receive_message", messageForDelivery)
      
      // Also send to sender for confirmation
      socket.emit("message_sent", messageForDelivery)
      
      // Update conversation lists for both users
      io.to(senderId).emit("conversation_updated")
      io.to(receiverId).emit("conversation_updated")
      
    } catch (err) {
      console.error("Socket message save error:", err)
      socket.emit("error", { message: "Failed to send message" })
    }
  })

  // Handle marking messages as read
  socket.on("mark_as_read", async (data) => {
    try {
      const { messageId } = data
      
      // Find the message
      const message = await Message.findById(messageId)
      
      if (!message) {
        socket.emit("error", { message: "Message not found" })
        return
      }
      
      // Check if user is the receiver
      if (message.receiverId.toString() !== socket.userId) {
        socket.emit("error", { message: "Not authorized to mark this message as read" })
        return
      }
      
      // Update message as read
      message.isRead = true
      message.readAt = new Date()
      await message.save()
      
      // Notify sender that their message was read
      socket.to(message.senderId.toString()).emit("message_read", {
        messageId: message._id
      })
      
    } catch (err) {
      console.error("Error marking message as read:", err)
      socket.emit("error", { message: "Failed to mark message as read" })
    }
  })

  // Handle typing indicators
  socket.on("typing", (data) => {
    socket.to(data.receiverId).emit("user_typing", {
      senderId: socket.userId,
      isTyping: data.isTyping,
    })
  })
  
  // Handle user going offline
  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`)
    
    // Remove user from online users
    onlineUsers.delete(socket.userId)
    
    // Update user's online status in DB
    User.findByIdAndUpdate(socket.userId, { 
      isOnline: false,
      lastSeen: new Date()
    }, (err) => {
      if (err) console.error("Error updating offline status:", err)
    })
    
    // Broadcast offline status to all users
    io.emit("user_offline", { userId: socket.userId })
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/profiles", authenticateToken, profileRoutes)
app.use("/api/messages", authenticateToken, messageRoutes)
app.use("/api/collaborations", authenticateToken, collaborationRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    onlineUsers: onlineUsers.size,
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
})

module.exports = { app, io, encryptMessage, decryptMessage }
