const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const env = require("./config/env");
const apiRoutes = require("./routes/index.routes");
const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Allows frontend localhost:3000 to load images from backend localhost:5000
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  }),
);

if (!env.isProduction) {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve local uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("ShopSphere backend is running");
});

app.use("/api", apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
