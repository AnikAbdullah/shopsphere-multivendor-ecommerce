const { z } = require("zod");

const imageSchema = z.object({
  url: z.string().trim().min(1, "Image URL is required"),
  alt: z.string().trim().optional(),
});

const variantSchema = z.object({
  color: z.string().trim().optional(),
  size: z.string().trim().optional(),
  stock: z.number().min(0, "Variant stock cannot be negative").optional(),
  sku: z.string().trim().optional(),
});

const createProductSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(120, "Product name cannot be more than 120 characters"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(3000, "Description cannot be more than 3000 characters"),

    brand: z.string().trim().optional(),

    category: z.string().min(1, "Category is required"),

    seller: z.string().optional(),

    price: z.number().min(0, "Price cannot be negative"),

    salePrice: z.number().min(0, "Sale price cannot be negative").optional(),

    images: z.array(imageSchema).optional(),

    variants: z.array(variantSchema).optional(),

    stock: z.number().min(0, "Stock cannot be negative"),

    isFeatured: z.boolean().optional(),

    isPublished: z.boolean().optional(),
  }),
});

const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Product name must be at least 2 characters")
        .max(120, "Product name cannot be more than 120 characters")
        .optional(),

      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(3000, "Description cannot be more than 3000 characters")
        .optional(),

      brand: z.string().trim().optional(),

      category: z.string().optional(),

      price: z.number().min(0, "Price cannot be negative").optional(),

      salePrice: z.number().min(0, "Sale price cannot be negative").optional(),

      images: z.array(imageSchema).optional(),

      variants: z.array(variantSchema).optional(),

      stock: z.number().min(0, "Stock cannot be negative").optional(),

      isFeatured: z.boolean().optional(),

      isPublished: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Please provide at least one field to update",
    }),
});

const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
};
