const mongoose = require("mongoose");
const { MONGODB_URI } = require("./environment");
const logger = require("../utils/logger");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.debug("MongoDB is already connected");
    return;
  }

  try {
    if (!MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables"
      );
    }

    await mongoose.connect(MONGODB_URI);
    isConnected = true;

    mongoose.connection.on("connected", () => {
      logger.debug("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.debug("MongoDB disconnected");
      isConnected = false;
    });
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.connection.close();
    isConnected = false;
    logger.debug("MongoDB connection closed");
  } catch (error) {
    logger.error("Error while closing MongoDB connection:", error);
  }
};

module.exports = { connectDB, disconnectDB };
