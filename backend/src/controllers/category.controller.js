const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort("name");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        categories,
      },
      "Categories fetched successfully",
    ),
  );
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, isActive } = req.validatedData.body;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new ApiError(409, "Category with this name already exists");
  }

  const category = await Category.create({
    name,
    description,
    image,
    isActive,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        category,
      },
      "Category created successfully",
    ),
  );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.validatedData.params;
  const updateData = req.validatedData.body;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (updateData.name && updateData.name !== category.name) {
    const existingCategory = await Category.findOne({
      name: updateData.name,
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw new ApiError(409, "Category with this name already exists");
    }
  }

  Object.keys(updateData).forEach((key) => {
    category[key] = updateData[key];
  });

  await category.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        category,
      },
      "Category updated successfully",
    ),
  );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.validatedData.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await category.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
