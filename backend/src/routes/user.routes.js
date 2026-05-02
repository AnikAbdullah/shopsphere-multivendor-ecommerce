const express = require("express");

const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/user.controller");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  updateProfileSchema,
  addAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
} = require("../validators/user.validator");

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);
router.patch("/profile", validate(updateProfileSchema), updateProfile);

router.post("/addresses", validate(addAddressSchema), addAddress);
router.patch(
  "/addresses/:addressId",
  validate(updateAddressSchema),
  updateAddress,
);
router.delete(
  "/addresses/:addressId",
  validate(deleteAddressSchema),
  deleteAddress,
);

module.exports = router;
