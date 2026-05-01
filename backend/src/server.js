const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    console.log(
      `Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`,
    );
  });
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
