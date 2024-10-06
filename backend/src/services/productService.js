const { Product, productValidationSchema } = require('../models/Product');
const moment = require('moment-timezone');
const logger = require('../utils/logger');
const {
  NotFoundError,
  BadRequestError,
  DatabaseConnectionError,
  InternalServerError,
} = require('../utils/errors');

const handleDatabaseError = (error) => {
  if (
    error.name === 'MongoNetworkError' ||
    error.name === 'MongoTimeoutError'
  ) {
    throw new DatabaseConnectionError();
  }
  throw error;
};

const productService = {
  async getProducts(brand) {
    try {
      const query = brand ? { brand: new RegExp(brand, 'i') } : {};
      return await Product.find(query).lean().exec();
    } catch (error) {
      handleDatabaseError(error);
      logger.error(`Error in getProducts: ${error.message}`, { error, brand });
      throw new BadRequestError('Error fetching products');
    }
  },

  async getWeeklyProducts(brand) {
    try {
      const now = moment().tz('Australia/Sydney');
      const currentDay = now.day();
      const currentHour = now.hour();

      let startDate = now
        .clone()
        .startOf('week')
        .add(3, 'days')
        .hour(7)
        .minute(0)
        .second(0);

      if (currentDay < 3 || (currentDay === 3 && currentHour < 7)) {
        startDate.subtract(7, 'days');
      }

      const endDate = startDate.clone().add(7, 'days').subtract(1, 'minute');

      const query = {
        $or: [
          { createdAt: { $gte: startDate.toDate(), $lt: endDate.toDate() } },
          { updatedAt: { $gte: startDate.toDate(), $lt: endDate.toDate() } },
        ],
      };

      if (brand) {
        query.brand = new RegExp(brand, 'i');
      }

      const weeklyProducts = await Product.find(query).lean().exec();

      return weeklyProducts;
    } catch (error) {
      logger.error(`Error in getWeeklyProducts: ${error.message}`, {
        error,
        brand,
      });
      throw new InternalServerError('Failed to retrieve weekly products');
    }
  },

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean().exec();
      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`);
      }
      return product;
    } catch (error) {
      handleDatabaseError(error);
      logger.error(`Error in getProductById: ${error.message}`, { error, id });
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError(`Invalid product ID: ${id}`);
    }
  },

  async getProductByName(name) {
    try {
      const product = await Product.findOne({ name: new RegExp(name, 'i') })
        .lean()
        .exec();
      if (!product) {
        throw new NotFoundError(`Product with name ${name} not found`);
      }
      return product;
    } catch (error) {
      handleDatabaseError(error);
      logger.error(`Error in getProductByName: ${error.message}`, {
        error,
        name,
      });
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError(`Error fetching product with name ${name}`);
    }
  },

  async getPriceHistory(id) {
    try {
      const product = await Product.findById(id, 'priceHistory').lean().exec();
      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`);
      }
      return product.priceHistory;
    } catch (error) {
      handleDatabaseError(error);
      logger.error(`Error in getPriceHistory: ${error.message}`, { error, id });
      if (error instanceof NotFoundError) throw error;
      throw new BadRequestError(
        `Error fetching price history for product with id ${id}`
      );
    }
  },

  async saveProducts(products) {
    try {
      const savedProducts = await Promise.all(
        products.map((product) => this.createProduct({ ...product }))
      );
      return savedProducts.filter(Boolean);
    } catch (error) {
      logger.error(`Error in saveProducts: ${error.message}`);
      throw new InternalServerError('Failed to save products to database');
    }
  },

  async createProduct(productData) {
    try {
      const { error } = productValidationSchema.validate(productData);
      if (error) {
        throw new BadRequestError(
          `Validation error: ${error.details[0].message}`
        );
      }

      const existingProduct = await Product.findOne({
        name: productData.name,
        brand: productData.brand,
      }).exec();
      if (existingProduct) {
        return await this.updateProduct(existingProduct._id, productData);
      }

      const priceHistoryEntry = {
        price: productData.price,
        savings: productData.savings,
        originalPrice: productData.originalPrice,
        pricePerUnit: productData.pricePerUnit,
        timestamp: new Date(),
      };

      const product = new Product({
        ...productData,
        priceHistory: [priceHistoryEntry],
      });

      const savedProduct = await product.save();
      return savedProduct;
    } catch (error) {
      logger.error(`Error in createProduct: ${error.message}`, {
        error,
        productData,
      });
      throw new BadRequestError(`Error creating product: ${error.message}`);
    }
  },

  async updateProduct(id, updateData) {
    try {
      const { error } = productValidationSchema.validate(updateData);
      if (error) {
        throw new BadRequestError(
          `Validation error: ${error.details[0].message}`
        );
      }

      const product = await Product.findById(id);
      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`);
      }

      const updatedFields = {};
      for (const [key, value] of Object.entries(updateData)) {
        if (product[key] !== value) {
          updatedFields[key] = value;
        }
      }

      if (
        updatedFields.price !== undefined &&
        updatedFields.price !== product.price
      ) {
        product.priceHistory.push({
          price: updatedFields.price,
          savings: updatedFields.savings || product.savings,
          originalPrice: updatedFields.originalPrice || product.originalPrice,
          pricePerUnit: updatedFields.pricePerUnit || product.pricePerUnit,
          timestamp: new Date(),
        });
      }

      Object.assign(product, updatedFields);
      const updatedProduct = await product.save();
      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(`Failed to update product with id ${id}`);
    }
  },

  async deleteProduct(id) {
    try {
      const result = await Product.findByIdAndDelete(id).lean().exec();
      if (!result) {
        throw new NotFoundError(`Product with id ${id} not found`);
      }
      return { message: 'Product successfully deleted' };
    } catch (error) {
      handleDatabaseError(error);
      logger.error(`Error in deleteProduct: ${error.message}`, { error, id });
      if (error instanceof NotFoundError) throw error;
      throw new InternalServerError(`Failed to delete product with id ${id}`);
    }
  },
};

module.exports = productService;
