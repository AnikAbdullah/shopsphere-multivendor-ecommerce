const express = require("express");

const { uploadProductImages } = require("../controllers/upload.controller");

const {
  uploadProductImages: uploadMiddleware,
} = require("../middlewares/upload.middleware");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/products",
  protect,
  authorizeRoles("admin", "seller"),
  uploadMiddleware.array("images", 5),
  uploadProductImages,
);

module.exports = router;
