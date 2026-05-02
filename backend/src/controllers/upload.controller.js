const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Please upload at least one product image");
  }

  const images = req.files.map((file) => ({
    filename: file.filename,
    url: `/uploads/products/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

  return res
    .status(201)
    .json(new ApiResponse(201, images, "Images uploaded successfully"));
});

module.exports = {
  uploadProductImages,
};
