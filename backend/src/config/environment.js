const dotenv = require('dotenv');
const path = require('path');
const logger = require('../utils/logger');

const environment = process.env.NODE_ENV || 'dev';

// Load .env file only for non-production environments
if (environment !== 'production') {
  const envFile = path.join(__dirname, `../../.env.${environment}`);
  dotenv.config({ path: envFile });
  logger.info(`Loaded environment variables from ${envFile}`);
} else {
  logger.info('Using environment variables from process.env');
}

module.exports = {
  NODE_ENV: environment,
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/halfprice',
};
