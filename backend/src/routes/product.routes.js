const express = require("express");

const {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
} = require("../validators/product.validator");

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:slug", getProductBySlug);

router.post(
  "/",
  protect,
  authorizeRoles("admin", "seller"),
  validate(createProductSchema),
  createProduct,
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("admin", "seller"),
  validate(updateProductSchema),
  updateProduct,
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "seller"),
  validate(deleteProductSchema),
  deleteProduct,
);

module.exports = router;
