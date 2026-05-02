const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      trim: true,
      default: "",
    },

    size: {
      type: String,
      trim: true,
      default: "",
    },

    stock: {
      type: Number,
      min: [0, "Variant stock cannot be negative"],
      default: 0,
    },

    sku: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },

    alt: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [120, "Product name cannot be more than 120 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [3000, "Description cannot be more than 3000 characters"],
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product seller is required"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative"],
      default: 0,
    },

    images: {
      type: [productImageSchema],
      default: [],
    },

    variants: {
      type: [variantSchema],
      default: [],
    },

    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    ratingAverage: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },

    ratingCount: {
      type: Number,
      min: [0, "Rating count cannot be negative"],
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
});

productSchema.pre("validate", function () {
  if (this.salePrice && this.salePrice > this.price) {
    this.invalidate(
      "salePrice",
      "Sale price cannot be greater than regular price",
    );
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
