const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/ApiError");

const uploadDir = path.join(process.cwd(), "uploads", "products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `product-${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${fileExtension}`;

    cb(null, fileName);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Only JPEG, JPG, PNG, and WEBP images are allowed"),
      false,
    );
  }

  cb(null, true);
};

const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = {
  uploadProductImages,
};
