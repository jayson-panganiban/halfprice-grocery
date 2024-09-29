const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('../src/utils/logger');

const environment = 'test';
const envFile = path.join(__dirname, `../.env.${environment}`);

dotenv.config({ path: envFile });
logger.info(`Loaded environment variables from ${envFile}`);

const { connectDB } = require('../src/config/database');

describe('Database Connection', () => {
  beforeAll(async () => {
    try {
      await connectDB();
    } catch (error) {
      logger.error('Failed to connect to the database:', error);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should connect to the database', () => {
    logger.info('MongoDB connection state:', mongoose.connection.readyState);
    expect(mongoose.connection.readyState).toBe(1);
  });
});
