const express = require("express");

const {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
} = require("../controllers/auth.controller");

const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");

const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.get("/me", protect, getCurrentUser);

module.exports = router;
