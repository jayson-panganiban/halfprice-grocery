const { Product } = require("../models");
const logger = require("../utils/logger");
const {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} = require("../utils/errors");

const productService = {
  async getProducts(brand) {
    try {
      const query = brand ? { brand: new RegExp(brand, "i") } : {};
      return await Product.find(query).lean().exec();
    } catch (error) {
      logger.error(`Error in getProducts: ${error.message}`, { error, brand });
      throw new BadRequestError("Error fetching products");
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
      logger.error(`Error in getProductById: ${error.message}`, { error, id });
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError(`Invalid product ID: ${id}`);
    }
  },

  async getPriceHistory(id) {
    try {
      const product = await Product.findById(id).lean().exec();
      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`);
      }
      return product.priceHistory;
    } catch (error) {
      logger.error(`Error in getPriceHistory: ${error.message}`, { error, id });
      throw new NotFoundError(
        `Error fetching price history for product with id ${id}`
      );
    }
  },

  async saveProducts(products, brand) {
    try {
      const savedProducts = await Promise.all(
        products.map((product) => this.createProduct({ ...product, brand }))
      );
      return savedProducts.filter(Boolean);
    } catch (error) {
      logger.error(`Error in saveProducts: ${error.message}`, { error, brand });
      throw new InternalServerError("Failed to save products to database");
    }
  },

  async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      newProduct.priceHistory.push({
        price: productData.price,
        pricePerUnit: productData.pricePerUnit,
        timestamp: new Date(),
      });
      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      logger.error(`Error in createProduct: ${error.message}`, {
        error,
        productData,
      });
      throw new BadRequestError("Error creating product: " + error.message);
    }
  },

  async updateProduct(id, updateData) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new NotFoundError(`Product with id ${id} not found`);
      }

      if (
        updateData.price !== product.price ||
        updateData.pricePerUnit !== product.pricePerUnit
      ) {
        product.priceHistory.push({
          price: updateData.price,
          pricePerUnit: updateData.pricePerUnit,
          timestamp: new Date(),
        });
        product.price = updateData.price;
        product.pricePerUnit = updateData.pricePerUnit;

        Object.assign(product, updateData);
        product.version += 1;
      }

      const updatedProduct = await product.save();
      return updatedProduct;
    } catch (error) {
      logger.error(`Error in updateProduct: ${error.message}`, {
        error,
        id,
        updateData,
      });
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
      return { message: "Product successfully deleted" };
    } catch (error) {
      logger.error(`Error in deleteProduct: ${error.message}`, { error, id });
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError(`Failed to delete product with id ${id}`);
    }
  },
};

module.exports = productService;
