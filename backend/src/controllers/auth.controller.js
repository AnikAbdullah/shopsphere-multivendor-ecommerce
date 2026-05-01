const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");
const { refreshTokenCookieOptions } = require("../utils/cookieOptions");

const cookieName = "refreshToken";

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

const sendAuthResponse = async (res, user, statusCode, message) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(statusCode)
    .cookie(cookieName, refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        statusCode,
        {
          user: buildUserResponse(user),
          accessToken,
        },
        message,
      ),
    );
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.validatedData.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: "customer",
  });

  return sendAuthResponse(res, user, 201, "User registered successfully");
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This user account is disabled");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  return sendAuthResponse(res, user, 200, "Logged in successfully");
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[cookieName];

  if (refreshToken) {
    await User.findOneAndUpdate(
      { refreshToken },
      {
        $set: {
          refreshToken: "",
        },
      },
    );
  }

  return res
    .status(200)
    .clearCookie(cookieName, refreshTokenCookieOptions)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.[cookieName];

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  const decoded = verifyRefreshToken(incomingRefreshToken);

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This user account is disabled");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is expired or already used");
  }

  const accessToken = generateAccessToken(user);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
      },
      "Access token refreshed successfully",
    ),
  );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: buildUserResponse(req.user),
      },
      "Current user fetched successfully",
    ),
  );
});

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshAccessToken,
};
