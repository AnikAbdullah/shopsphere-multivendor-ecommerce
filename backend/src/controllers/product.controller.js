const mongoose = require("mongoose");

const Product = require("../models/Product");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("../utils/slugify");

const {
  buildProductFilter,
  getSortOption,
  getPagination,
} = require("../utils/apiFeatures");

const checkCategoryExists = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

const checkProductOwnership = (product, user) => {
  if (user.role === "admin") {
    return;
  }

  if (
    user.role === "seller" &&
    product.seller.toString() === user._id.toString()
  ) {
    return;
  }

  throw new ApiError(403, "You do not have permission to manage this product");
};

const getProducts = asyncHandler(async (req, res) => {
  const filter = buildProductFilter(req.query);

  filter.isPublished = true;

  const sort = getSortOption(req.query.sort);
  const { page, limit, skip } = getPagination(req.query);

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("seller", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page,
          limit,
          totalProducts,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Products fetched successfully",
    ),
  );
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isPublished: true,
    isFeatured: true,
  })
    .populate("category", "name slug")
    .populate("seller", "name email")
    .sort("-createdAt")
    .limit(8);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
      },
      "Featured products fetched successfully",
    ),
  );
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({
    slug,
    isPublished: true,
  })
    .populate("category", "name slug")
    .populate("seller", "name email");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        product,
      },
      "Product fetched successfully",
    ),
  );
});

const createProduct = asyncHandler(async (req, res) => {
  const productData = req.validatedData.body;

  await checkCategoryExists(productData.category);

  const productSlug = slugify(productData.name);

  const existingProduct = await Product.findOne({ slug: productSlug });

  if (existingProduct) {
    throw new ApiError(409, "Product with this name already exists");
  }

  const seller =
    req.user.role === "seller"
      ? req.user._id
      : productData.seller || req.user._id;

  const product = await Product.create({
    ...productData,
    seller,
    createdBy: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        product,
      },
      "Product created successfully",
    ),
  );
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.validatedData.params;
  const updateData = req.validatedData.body;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  checkProductOwnership(product, req.user);

  if (updateData.category) {
    await checkCategoryExists(updateData.category);
  }

  if (updateData.name && updateData.name !== product.name) {
    const productSlug = slugify(updateData.name);

    const existingProduct = await Product.findOne({
      slug: productSlug,
      _id: { $ne: id },
    });

    if (existingProduct) {
      throw new ApiError(409, "Product with this name already exists");
    }
  }

  Object.keys(updateData).forEach((key) => {
    product[key] = updateData[key];
  });

  await product.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        product,
      },
      "Product updated successfully",
    ),
  );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.validatedData.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  checkProductOwnership(product, req.user);

  await product.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
