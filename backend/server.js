require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const { createServer } = require("http")
const { Server } = require("socket.io")
const crypto = require("crypto")
const { encryptMessage, decryptMessage } = require("./utils/encryption")

// Import routes
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const profileRoutes = require("./routes/profiles")
const messageRoutes = require("./routes/messages")
const collaborationRoutes = require("./routes/collaborations")
const meetingRoutes = require("./routes/meetings")
const documentsRoutes = require("./routes/documents")
const notificationRoutes = require("./routes/notifications")
const paymentRoutes = require("./routes/payments")
const dealsRoutes = require("./routes/deals")

// Import middleware
const { authenticateToken } = require("./middleware/auth")
const errorHandler = require("./middleware/errorHandler")
const { apiLimiter, securityHeaders, sanitizeInput, xssProtection } = require("./middleware/security")

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

// Expose io to routes that want to emit socket events (e.g., messages API)
app.set("io", io)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
)

app.use(securityHeaders)

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use("/api/", apiLimiter)

app.use(sanitizeInput)
app.use(xssProtection)

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

// Encryption key (in production, use a secure key management system)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex")

// ✅ Register Socket.IO modules
require("./sockets/webrtc")(io)  // existing WebRTC signaling
require("./sockets/chat")(io)    // new chat and presence socket module

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/profiles", authenticateToken, profileRoutes)
app.use("/api/messages", authenticateToken, messageRoutes)
app.use("/api/collaborations", authenticateToken, collaborationRoutes)
app.use("/api/meetings", authenticateToken, meetingRoutes)
app.use("/api/documents", authenticateToken, documentsRoutes)
app.use("/api/notifications", authenticateToken, notificationRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/deals", authenticateToken, dealsRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    security: {
      helmet: "enabled",
      rateLimiting: "enabled",
      inputSanitization: "enabled",
      xssProtection: "enabled",
    },
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
  console.log(`🔒 Security: Enhanced (Helmet, Rate Limiting, Input Sanitization, XSS Protection)`)
})

module.exports = { app, io, encryptMessage, decryptMessage }







