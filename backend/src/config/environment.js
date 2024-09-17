const dotenv = require("dotenv");
const path = require("path");
const logger = require("../utils/logger");

const environment = process.env.NODE_ENV || "dev";
const envFile = path.join(__dirname, `../../.env.${environment}`);

dotenv.config({ path: envFile });

logger.info(`Loaded environment variables from ${envFile}`);

module.exports = {
  NODE_ENV: environment,
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI,
  API_URL: process.env.API_URL || "http://localhost:3001",
};
