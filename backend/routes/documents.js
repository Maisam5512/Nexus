const express = require("express")
const router = express.Router()
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

// Configure multer for document uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "nexus/documents",
    allowed_formats: ["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png"],
    resource_type: "auto",
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// Upload document
router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const documentData = {
      filename: req.file.originalname,
      url: req.file.path,
      publicId: req.file.filename,
      size: req.file.bytes,
      uploadedBy: req.user.userId,
      uploadedAt: new Date(),
    }

    res.status(200).json({
      message: "Document uploaded successfully",
      document: documentData,
    })
  } catch (error) {
    console.error("Document upload error:", error)
    res.status(500).json({ message: "Failed to upload document" })
  }
})

// Delete document
router.delete("/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId)

    res.status(200).json({ message: "Document deleted successfully" })
  } catch (error) {
    console.error("Document deletion error:", error)
    res.status(500).json({ message: "Failed to delete document" })
  }
})

module.exports = router
