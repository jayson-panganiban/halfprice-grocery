const dotenv = require("dotenv");
const path = require("path");

const environment = process.env.NODE_ENV || "dev";
const envFile = path.join(__dirname, `../../.env.${environment}`);

dotenv.config({ path: envFile });

console.log(`Loading environment from: ${envFile}`);

module.exports = {
  NODE_ENV: environment,
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI,
};
