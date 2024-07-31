const mongoose = require("mongoose");
const { MONGODB_URI } = require("./environment");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables"
      );
    }
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
