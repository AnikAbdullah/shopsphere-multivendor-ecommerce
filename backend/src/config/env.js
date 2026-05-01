const dotenv = require("dotenv");

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5001,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopsphere",
  isProduction: process.env.NODE_ENV === "production",
};

module.exports = env;
