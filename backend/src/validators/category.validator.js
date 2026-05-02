const { z } = require("zod");

const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(80, "Category name cannot be more than 80 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot be more than 500 characters")
      .optional(),

    image: z.string().trim().optional(),

    isActive: z.boolean().optional(),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),

  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters")
        .max(80, "Category name cannot be more than 80 characters")
        .optional(),

      description: z
        .string()
        .trim()
        .max(500, "Description cannot be more than 500 characters")
        .optional(),

      image: z.string().trim().optional(),

      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Please provide at least one field to update",
    }),
});

const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Category ID is required"),
  }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
};
