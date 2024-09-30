const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

const config = require('./config/environment');
const { connectDB, disconnectDB } = require('./config/database');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

function setupMiddleware() {
  app.use(helmet());
  app.use(cors());
  app.use(xss());
  app.use(hpp());
  app.use(mongoSanitize());
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  if (config.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
}

function setupRoutes() {
  app.use('/api', routes);
  app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
}

function setupErrorHandling() {
  app.use(errorHandler);
}

async function startServer() {
  try {
    await connectDB();
    const port = config.PORT || 3000;
    const server = app.listen(port, () => {
      logger.info(`Server running in ${config.NODE_ENV} mode on port ${port}`);
    });
    setupGracefulShutdown(server);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

function setupGracefulShutdown(server) {
  const shutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown`);
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDB();
      logger.info('Graceful shutdown completed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

setupMiddleware();
setupRoutes();
setupErrorHandling();

if (require.main === module) {
  startServer().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

module.exports = { app, startServer };
