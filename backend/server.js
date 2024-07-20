const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const config = require("./src/config/environment");
const connectDB = require("./src/config/database");
const routes = require("./src/index");
const mongoose = require("mongoose");
const logger = require("./src/logger");

function createServer() {
  const app = express();

  // Middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    })
  );
  app.use(cors());
  app.use(express.json());
  app.use(compression());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  if (config.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  // Use the routes
  app.use("/api", routes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send("Something broke!");
  });

  return app;
}

async function startServer() {
  try {
    await connectDB();
    const app = createServer();
    const port = config.PORT;
    const server = app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    // Graceful shutdown
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
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

module.exports = { createServer, startServer };

if (require.main === module) {
  startServer();
}
