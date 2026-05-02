const { z } = require("zod");

const updateProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(60, "Name cannot be more than 60 characters")
        .optional(),

      phone: z.string().trim().optional(),

      avatar: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Please provide at least one field to update",
    }),
});

const addAddressSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2, "Full name is required"),

    phone: z.string().trim().min(5, "Phone number is required"),

    street: z.string().trim().min(3, "Street address is required"),

    city: z.string().trim().min(2, "City is required"),

    state: z.string().trim().optional(),

    postalCode: z.string().trim().optional(),

    country: z.string().trim().default("Bangladesh"),

    isDefault: z.boolean().optional(),
  }),
});

const updateAddressSchema = z.object({
  params: z.object({
    addressId: z.string().min(1, "Address ID is required"),
  }),

  body: z
    .object({
      fullName: z.string().trim().min(2, "Full name is required").optional(),

      phone: z.string().trim().min(5, "Phone number is required").optional(),

      street: z.string().trim().min(3, "Street address is required").optional(),

      city: z.string().trim().min(2, "City is required").optional(),

      state: z.string().trim().optional(),

      postalCode: z.string().trim().optional(),

      country: z.string().trim().optional(),

      isDefault: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Please provide at least one field to update",
    }),
});

const deleteAddressSchema = z.object({
  params: z.object({
    addressId: z.string().min(1, "Address ID is required"),
  }),
});

module.exports = {
  updateProfileSchema,
  addAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
};
