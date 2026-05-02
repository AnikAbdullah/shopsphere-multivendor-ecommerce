const express = require("express");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} = require("../validators/category.validator");

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validate(createCategorySchema),
  createCategory,
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validate(updateCategorySchema),
  updateCategory,
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validate(deleteCategorySchema),
  deleteCategory,
);

module.exports = router;
