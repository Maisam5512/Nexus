const express = require("express")
const CollaborationRequest = require("../models/CollaborationRequest")
const User = require("../models/User")
const { requireRole } = require("../middleware/auth")
const { validateObjectId } = require("../middleware/validation")
const { body, query } = require("express-validator")

const router = express.Router()

// @route   POST /api/collaborations/request
// @desc    Create collaboration request
// @access  Private
router.post(
  "/request",
  [
    body("entrepreneurId").isMongoId().withMessage("Valid entrepreneur ID is required"),
    body("requestType").isIn(["investment", "mentorship", "partnership", "advisory"]),
    body("message").trim().isLength({ min: 10, max: 1000 }),
    body("proposedAmount").optional().trim().isLength({ max: 50 }),
    body("proposedTerms").optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    try {
      const { entrepreneurId, requestType, message, proposedAmount, proposedTerms } = req.body
      const investorId = req.user.id

      // Check if entrepreneur exists
      const entrepreneur = await User.findById(entrepreneurId)
      if (!entrepreneur || entrepreneur.role !== "entrepreneur") {
        return res.status(404).json({
          message: "Entrepreneur not found",
          code: "ENTREPRENEUR_NOT_FOUND",
        })
      }

      // Check for existing pending request
      const existingRequest = await CollaborationRequest.findOne({
        investorId,
        entrepreneurId,
        status: "pending",
      })

      if (existingRequest) {
        return res.status(400).json({
          message: "You already have a pending request with this entrepreneur",
          code: "REQUEST_EXISTS",
        })
      }

      const collaborationRequest = new CollaborationRequest({
        investorId,
        entrepreneurId,
        requestType,
        message,
        proposedAmount,
        proposedTerms,
      })

      await collaborationRequest.save()

      // Populate user data
      await collaborationRequest.populate("investorId", "name email avatarUrl")
      await collaborationRequest.populate("entrepreneurId", "name email avatarUrl")

      res.status(201).json({
        message: "Collaboration request sent successfully",
        request: collaborationRequest,
      })
    } catch (error) {
      console.error("Create collaboration request error:", error)
      res.status(500).json({
        message: "Failed to create collaboration request",
        code: "CREATE_REQUEST_FAILED",
      })
    }
  },
)

// @route   GET /api/collaborations/requests
// @desc    Get collaboration requests for current user
// @access  Private
router.get(
  "/requests",
  [
    query("status").optional().isIn(["pending", "accepted", "rejected", "withdrawn", "expired"]),
    query("type").optional().isIn(["sent", "received"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
  ],
  async (req, res) => {
    try {
      const userId = req.user.id
      const userRole = req.user.role
      const { status, type, page = 1, limit = 10 } = req.query
      const skip = (page - 1) * limit

      // Build query
      const query = {}

      if (status) {
        query.status = status
      }

      // Determine request direction
      if (type === "sent") {
        if (userRole === "investor") {
          query.investorId = userId
        } else {
          query.entrepreneurId = userId
        }
      } else if (type === "received") {
        if (userRole === "investor") {
          query.entrepreneurId = userId
        } else {
          query.investorId = userId
        }
      } else {
        // Both sent and received
        query.$or = [{ investorId: userId }, { entrepreneurId: userId }]
      }

      const requests = await CollaborationRequest.find(query)
        .populate("investorId", "name email avatarUrl role")
        .populate("entrepreneurId", "name email avatarUrl role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number.parseInt(limit))

      const total = await CollaborationRequest.countDocuments(query)

      res.json({
        requests,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRequests: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      })
    } catch (error) {
      console.error("Get collaboration requests error:", error)
      res.status(500).json({
        message: "Failed to fetch collaboration requests",
        code: "FETCH_REQUESTS_FAILED",
      })
    }
  },
)

// @route   PUT /api/collaborations/requests/:requestId/accept
// @desc    Accept collaboration request
// @access  Private (Entrepreneurs only)
router.put(
  "/requests/:requestId/accept",
  validateObjectId("requestId"),
  requireRole(["entrepreneur"]),
  [body("responseMessage").optional().trim().isLength({ max: 1000 })],
  async (req, res) => {
    try {
      const { responseMessage } = req.body
      const request = await CollaborationRequest.findById(req.params.requestId)

      if (!request) {
        return res.status(404).json({
          message: "Collaboration request not found",
          code: "REQUEST_NOT_FOUND",
        })
      }

      // Check if user is the entrepreneur in this request
      if (request.entrepreneurId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Not authorized to accept this request",
          code: "NOT_AUTHORIZED",
        })
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          message: "Request is no longer pending",
          code: "REQUEST_NOT_PENDING",
        })
      }

      await request.accept(responseMessage)

      // Populate user data
      await request.populate("investorId", "name email avatarUrl")
      await request.populate("entrepreneurId", "name email avatarUrl")

      res.json({
        message: "Collaboration request accepted",
        request,
      })
    } catch (error) {
      console.error("Accept collaboration request error:", error)
      res.status(500).json({
        message: "Failed to accept collaboration request",
        code: "ACCEPT_REQUEST_FAILED",
      })
    }
  },
)

// @route   PUT /api/collaborations/requests/:requestId/reject
// @desc    Reject collaboration request
// @access  Private (Entrepreneurs only)
router.put(
  "/requests/:requestId/reject",
  validateObjectId("requestId"),
  requireRole(["entrepreneur"]),
  [body("responseMessage").optional().trim().isLength({ max: 1000 })],
  async (req, res) => {
    try {
      const { responseMessage } = req.body
      const request = await CollaborationRequest.findById(req.params.requestId)

      if (!request) {
        return res.status(404).json({
          message: "Collaboration request not found",
          code: "REQUEST_NOT_FOUND",
        })
      }

      // Check if user is the entrepreneur in this request
      if (request.entrepreneurId.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Not authorized to reject this request",
          code: "NOT_AUTHORIZED",
        })
      }

      if (request.status !== "pending") {
        return res.status(400).json({
          message: "Request is no longer pending",
          code: "REQUEST_NOT_PENDING",
        })
      }

      await request.reject(responseMessage)

      // Populate user data
      await request.populate("investorId", "name email avatarUrl")
      await request.populate("entrepreneurId", "name email avatarUrl")

      res.json({
        message: "Collaboration request rejected",
        request,
      })
    } catch (error) {
      console.error("Reject collaboration request error:", error)
      res.status(500).json({
        message: "Failed to reject collaboration request",
        code: "REJECT_REQUEST_FAILED",
      })
    }
  },
)

module.exports = router
