const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const buildUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    addresses: user.addresses,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: buildUserResponse(req.user),
      },
      "Profile fetched successfully",
    ),
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.validatedData.body;

  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (avatar !== undefined) req.user.avatar = avatar;

  await req.user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: buildUserResponse(req.user),
      },
      "Profile updated successfully",
    ),
  );
});

const addAddress = asyncHandler(async (req, res) => {
  const addressData = req.validatedData.body;

  if (addressData.isDefault) {
    req.user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }

  req.user.addresses.push(addressData);

  await req.user.save({ validateBeforeSave: false });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        addresses: req.user.addresses,
      },
      "Address added successfully",
    ),
  );
});

const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.validatedData.params;
  const updateData = req.validatedData.body;

  const address = req.user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (updateData.isDefault) {
    req.user.addresses.forEach((item) => {
      item.isDefault = false;
    });
  }

  Object.keys(updateData).forEach((key) => {
    address[key] = updateData[key];
  });

  await req.user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        addresses: req.user.addresses,
      },
      "Address updated successfully",
    ),
  );
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.validatedData.params;

  const address = req.user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  req.user.addresses.pull(addressId);

  await req.user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        addresses: req.user.addresses,
      },
      "Address deleted successfully",
    ),
  );
});

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
};
