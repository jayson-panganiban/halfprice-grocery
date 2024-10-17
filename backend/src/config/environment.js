const dotenv = require('dotenv');
const path = require('path');
const envalid = require('envalid');
const logger = require('../utils/logger');

const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  throw new Error(
    'NODE_ENV is not set. Please set it to "development", "test", or "production".'
  );
}

// Load .env file only for non-production environments
if (NODE_ENV !== 'production') {
  const envFile = path.resolve(__dirname, `../../.env.${NODE_ENV}`);
  dotenv.config({ path: envFile });
  logger.info(`Loaded environment variables from ${envFile}`);
} else {
  logger.info(
    'Running in production mode. Ensure all necessary environment variables are set.'
  );
}

// Validate and export environment variables
const env = envalid.cleanEnv(process.env, {
  NODE_ENV: envalid.str({ choices: ['development', 'test', 'production'] }),
  PORT: envalid.port({ default: 3003 }),
  MONGODB_URI: envalid.str(),
});

module.exports = {
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
  MONGODB_URI: env.MONGODB_URI,
};
