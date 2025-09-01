const { body, param, query, validationResult } = require("express-validator")

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    })
  }
  next()
}

// Common validation rules
const validateEmail = body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address")

const validatePassword = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage(
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  )

const validateName = body("name")
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage("Name must be between 2 and 50 characters")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Name can only contain letters and spaces")

const validateRole = body("role")
  .isIn(["entrepreneur", "investor"])
  .withMessage("Role must be either entrepreneur or investor")

const validateObjectId = (field) => param(field).isMongoId().withMessage(`Invalid ${field} format`)

// Registration validation
const validateRegistration = [
  validateName,
  validateEmail,
  validatePassword,
  validateRole,
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match")
    }
    return true
  }),
  handleValidationErrors,
]

// Login validation
const validateLogin = [
  validateEmail,
  body("password").notEmpty().withMessage("Password is required"),
  validateRole,
  handleValidationErrors,
]

// Profile update validation
const validateProfileUpdate = [
  body("name").optional().trim().isLength({ min: 2, max: 50 }),
  body("bio").optional().trim().isLength({ max: 500 }),
  body("location").optional().trim().isLength({ max: 100 }),
  body("website").optional().isURL(),
  body("linkedin").optional().isURL(),
  body("twitter").optional().isURL(),
  handleValidationErrors,
]

// Entrepreneur profile validation
const validateEntrepreneurProfile = [
  body("startupName").trim().isLength({ min: 2, max: 100 }),
  body("industry").trim().isLength({ min: 2, max: 50 }),
  body("foundedYear").isInt({ min: 1900, max: new Date().getFullYear() }),
  body("teamSize").isInt({ min: 1, max: 10000 }),
  body("fundingNeeded").trim().isLength({ min: 1, max: 50 }),
  body("pitchSummary").trim().isLength({ min: 10, max: 1000 }),
  handleValidationErrors,
]

// Investor profile validation
const validateInvestorProfile = [
  body("investmentInterests").isArray({ min: 1 }),
  body("investmentStage").isArray({ min: 1 }),
  body("minimumInvestment").trim().isLength({ min: 1, max: 50 }),
  body("maximumInvestment").trim().isLength({ min: 1, max: 50 }),
  body("portfolioCompanies").optional().isArray(),
  handleValidationErrors,
]

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateEntrepreneurProfile,
  validateInvestorProfile,
  validateObjectId,
}
