const dotenv = require('dotenv');
const path = require('path');
const logger = require('../utils/logger');
const fs = require('fs');

const environment = process.env.NODE_ENV || 'dev';
const envFile = path.join(__dirname, `../../.env.${environment}`);

const envFileContents = fs.readFileSync(envFile, 'utf8');
logger.info(`Contents of ${envFile}:\n${envFileContents}`);

dotenv.config({ path: envFile });

module.exports = {
  NODE_ENV: environment,
  PORT: process.env.PORT || 3001,
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/halfprice_dev',
};
