const env = require("../config/env");

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
  refreshTokenCookieOptions,
};
