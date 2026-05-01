const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAccessToken } = require("../utils/token");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "You are not logged in");
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User belonging to this token no longer exists");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This user account is disabled");
  }

  req.user = user;
  next();
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "You are not logged in"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to access this resource"),
      );
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};
