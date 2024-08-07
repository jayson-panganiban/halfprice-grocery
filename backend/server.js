const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const { createServer } = require("http");
const config = require("./src/config/environment");
const connectDB = require("./src/config/database");
const routes = require("./src/routes");
const logger = require("./src/utils/logger");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

if (config.NODE_ENV === "production") {
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
}

if (config.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api", routes);

app.use(errorHandler);

const server = createServer(app);

async function startServer() {
  try {
    await connectDB();
    server.listen(config.PORT, () => {
      logger.info(
        `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
  });
});

module.exports = { app, startServer };

if (require.main === module) {
  startServer();
}
