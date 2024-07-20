const dotenv = require("dotenv");
const path = require("path");

const environment = process.env.NODE_ENV || "dev";
dotenv.config({ path: path.join(__dirname, `../../.env.${environment}`) });

module.exports = {
  NODE_ENV: environment,
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
};
