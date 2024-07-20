const Product = require("../models/Product");
const logger = require("../logger");

const productService = {
  async saveProducts(products) {
    try {
      const savedProducts = await Product.insertMany(products);
      logger.info(`Saved ${savedProducts.length} products to the database`);
      return savedProducts;
    } catch (error) {
      logger.error("Error saving products to database:", error);
      throw error;
    }
  },

  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      logger.error("Error fetching products from database:", error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      logger.error(
        `Error fetching product with id ${id} from database:`,
        error
      );
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();
      logger.info(`Created new product with id ${savedProduct._id}`);
      return savedProduct;
    } catch (error) {
      logger.error("Error creating product:", error);
      throw error;
    }
  },

  async updateProduct(id, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedProduct) {
        logger.warn(`Product with id ${id} not found for update`);
        return null;
      }
      logger.info(`Updated product with id ${id}`);
      return updatedProduct;
    } catch (error) {
      logger.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        logger.warn(`Product with id ${id} not found for deletion`);
        return null;
      }
      logger.info(`Deleted product with id ${id}`);
      return deletedProduct;
    } catch (error) {
      logger.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },
};

module.exports = productService;
