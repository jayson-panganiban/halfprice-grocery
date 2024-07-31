const { Product } = require("../models");
const logger = require("../utils/logger");
const { NotFoundError, BadRequestError } = require("../utils/errors");

const productService = {
  async getProducts(brand) {
    try {
      const query = brand ? { brand: new RegExp(brand, "i") } : {};
      return await Product.find(query).lean().exec();
    } catch (error) {
      logger.error("Error fetching products:", error);
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
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error(`Error fetching product with id ${id}:`, error);
      throw new BadRequestError("Invalid product ID");
    }
  },

  async saveProducts(products, brand) {
    try {
      const savedProducts = await Promise.all(
        products.map((product) => this.createProduct({ ...product, brand }))
      );
      return savedProducts.filter(Boolean);
    } catch (error) {
      logger.error("Error saving products to database:", error);
      throw error;
    }
  },

  async createProduct(productData) {
    if (!productData.name?.trim()) {
      logger.info("Skipping product creation due to empty or null name");
      return null;
    }

    try {
      const existingProduct = await Product.findOne({
        name: productData.name,
        brand: productData.brand,
      })
        .lean()
        .exec();

      if (existingProduct) {
        return existingProduct;
      }

      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      logger.error("Error creating product:", error);
      throw error;
    }
  },

  async updateProduct(id, updateData) {
    try {
      return await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .lean()
        .exec();
    } catch (error) {
      logger.error(`Error updating product with id ${id}:`, error);
      throw error;
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
      logger.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },
};

module.exports = productService;
