const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const productService = require('../src/services/productService');
const { Product } = require('../src/models/Product');
const { NotFoundError } = require('../src/utils/errors');
const moment = require('moment-timezone');
const logger = require('../src/utils/logger');
const { request } = require('http');
const e = require('express');
const { expect } = require('@playwright/test');

describe('Product Service', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('getProducts', () => {
    test('should return all products when no brand is specified', async () => {
      await productService.saveProducts([
        {
          name: 'Product 1',
          brand: 'Brand A',
          price: 10,
          savings: 2,
          originalPrice: 12,
          pricePerUnit: '$1/unit',
          link: 'http://example.com/1',
          image: 'http://example.com/1.jpg',
        },
        {
          name: 'Product 2',
          brand: 'Brand B',
          price: 20,
          savings: 5,
          originalPrice: 25,
          pricePerUnit: '$2/unit',
          link: 'http://example.com/2',
          image: 'http://example.com/2.jpg',
        },
      ]);

      const products = await productService.getProducts();
      expect(products).toHaveLength(2);
    });

    test('should return filtered products when brand is specified', async () => {
      await productService.saveProducts([
        {
          name: 'Product 1',
          brand: 'Brand A',
          price: 10,
          savings: 2,
          originalPrice: 12,
          pricePerUnit: '$1/unit',
          link: 'http://example.com/1',
          image: 'http://example.com/1.jpg',
        },
        {
          name: 'Product 2',
          brand: 'Brand B',
          price: 20,
          savings: 5,
          originalPrice: 25,
          pricePerUnit: '$2/unit',
          link: 'http://example.com/2',
          image: 'http://example.com/2.jpg',
        },
      ]);

      const products = await productService.getProducts('Brand A');
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Product 1');
    });
  });

  describe('getProductById', () => {
    test('should return a product when valid id is provided', async () => {
      const createdProduct = await productService.createProduct({
        name: 'Test Product',
        price: 10,
        brand: 'Test Brand',
        savings: 2,
        originalPrice: 12,
        pricePerUnit: '$1/unit',
        link: 'http://example.com/test',
        image: 'http://example.com/test.jpg',
      });
      const product = await productService.getProductById(createdProduct._id);
      expect(product.name).toBe('Test Product');
    });

    test('should throw NotFoundError when product is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(
        productService.getProductById(nonExistentId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getPriceHistory', () => {
    test('should return price history for a product', async () => {
      const product = await productService.createProduct({
        name: 'Test Product',
        price: 10,
        brand: 'Test Brand',
        savings: 2,
        originalPrice: 12,
        pricePerUnit: '$1/unit',
        link: 'http://example.com/test',
        image: 'http://example.com/test.jpg',
        priceHistory: [
          {
            price: 10,
            savings: 2,
            originalPrice: 12,
            pricePerUnit: '$1/unit',
            timestamp: new Date(),
          },
        ],
      });
      const priceHistory = await productService.getPriceHistory(product._id);
      expect(priceHistory).toHaveLength(1);
      expect(priceHistory[0].price).toBe(10);
    });

    test('should throw NotFoundError when product is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(
        productService.getPriceHistory(nonExistentId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getWeeklyProducts', () => {
    test('should return all weekly products when no brand is specified', async () => {
      const currentDate = new Date();
      const oldDate = new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000); // 8 days ago

      await Product.create([
        {
          name: 'Weekly Product 1',
          brand: 'Brand X',
          price: 9.99,
          savings: 2.0,
          originalPrice: 11.99,
          pricePerUnit: '$9.99/kg',
          link: 'https://example.com/product1',
          image: 'https://example.com/product1.jpg',
          createdAt: currentDate,
        },
        {
          name: 'Weekly Product 2',
          brand: 'Brand Y',
          price: 19.99,
          savings: 5.0,
          originalPrice: 24.99,
          pricePerUnit: '$19.99/kg',
          link: 'https://example.com/product2',
          image: 'https://example.com/product2.jpg',
          createdAt: currentDate,
        },
        {
          name: 'Old Product',
          brand: 'Brand Z',
          price: 29.99,
          savings: 7.0,
          originalPrice: 36.99,
          pricePerUnit: '$29.99/kg',
          link: 'https://example.com/product3',
          image: 'https://example.com/product3.jpg',
          createdAt: oldDate,
        },
      ]);

      const weeklyProducts = await productService.getWeeklyProducts();
      expect(weeklyProducts).toHaveLength(2);
      expect(weeklyProducts[0].name).toBe('Weekly Product 1');
      expect(weeklyProducts[1].name).toBe('Weekly Product 2');
    });

    test('should return filtered weekly products when brand is specified', async () => {
      const currentDate = new Date();

      await Product.create([
        {
          name: 'Weekly Product 1',
          brand: 'Brand X',
          price: 9.99,
          savings: 2.0,
          originalPrice: 11.99,
          pricePerUnit: '$9.99/kg',
          link: 'https://example.com/product1',
          image: 'https://example.com/product1.jpg',
          createdAt: currentDate,
        },
        {
          name: 'Weekly Product 2',
          brand: 'Brand Y',
          price: 19.99,
          savings: 5.0,
          originalPrice: 24.99,
          pricePerUnit: '$19.99/kg',
          link: 'https://example.com/product2',
          image: 'https://example.com/product2.jpg',
          createdAt: currentDate,
        },
      ]);

      const weeklyProducts = await productService.getWeeklyProducts('Brand X');
      expect(weeklyProducts).toHaveLength(1);
      expect(weeklyProducts[0].name).toBe('Weekly Product 1');
      expect(weeklyProducts[0].brand).toBe('Brand X');
    });
  });

  describe('saveProducts', () => {
    test('should save multiple products', async () => {
      const products = [
        {
          name: 'Product 1',
          brand: 'Brand X',
          price: 9.99,
          savings: 2.0,
          originalPrice: 11.99,
          pricePerUnit: '$9.99/kg',
          link: 'https://example.com/product1',
          image: 'https://example.com/product1.jpg',
        },
        {
          name: 'Product 2',
          brand: 'Brand X',
          price: 19.99,
          savings: 5.0,
          originalPrice: 24.99,
          pricePerUnit: '$19.99/kg',
          link: 'https://example.com/product2',
          image: 'https://example.com/product2.jpg',
        },
      ];
      const savedProducts = await productService.saveProducts(products);
      expect(savedProducts).toHaveLength(2);
      expect(savedProducts[0].name).toBe('Product 1');
      expect(savedProducts[0].price).toBe(9.99);
      expect(savedProducts[0].priceHistory[0].price).toBe(9.99);
      expect(savedProducts[0].priceHistory[0].savings).toBe(2.0);
      expect(savedProducts[0].priceHistory[0].originalPrice).toBe(11.99);

      expect(savedProducts[1].name).toBe('Product 2');
      expect(savedProducts[1].price).toBe(19.99);
      expect(savedProducts[1].priceHistory[0].price).toBe(19.99);
      expect(savedProducts[1].priceHistory[0].savings).toBe(5.0);
      expect(savedProducts[1].priceHistory[0].originalPrice).toBe(24.99);
    });
  });

  describe('createProduct', () => {
    test('should create a new product', async () => {
      const product = {
        name: 'New Product',
        price: 15,
        brand: 'Brand C',
        savings: 5,
        originalPrice: 20,
        pricePerUnit: '$1.5/unit',
        link: 'http://example.com',
        image: 'http://example.com/image.jpg',
      };

      const createdProduct = await productService.createProduct(product);

      expect(createdProduct.name).toBe('New Product');
      expect(createdProduct.priceHistory).toHaveLength(1);
      expect(createdProduct.priceHistory[0].price).toBe(15);
      expect(createdProduct.brand).toBe('Brand C');
      expect(createdProduct.savings).toBe(5);
      expect(createdProduct.originalPrice).toBe(20);
      expect(createdProduct.pricePerUnit).toBe('$1.5/unit');
      expect(createdProduct.link).toBe('http://example.com');
      expect(createdProduct.image).toBe('http://example.com/image.jpg');
    });

    test('should create a new product with missing pricePerUnit', async () => {
      const product = {
        name: 'New Product',
        price: 15,
        brand: 'Brand C',
        savings: 5,
        originalPrice: 20,
        pricePerUnit: null,
        link: 'http://example.com',
        image: 'http://example.com/image.jpg',
      };

      const createdProduct = await productService.createProduct(product);

      expect(createdProduct.name).toBe('New Product');
      expect(createdProduct.priceHistory).toHaveLength(1);
      expect(createdProduct.priceHistory[0].price).toBe(15);
      expect(createdProduct.brand).toBe('Brand C');
      expect(createdProduct.savings).toBe(5);
      expect(createdProduct.originalPrice).toBe(20);
      expect(createdProduct.pricePerUnit).toBe(null);
      expect(createdProduct.link).toBe('http://example.com');
      expect(createdProduct.image).toBe('http://example.com/image.jpg');
    });
  });

  describe('updateProduct', () => {
    test('should update an existing product', async () => {
      const existingProduct = await productService.createProduct({
        name: 'Product X',
        brand: 'Brand X',
        price: 10,
        savings: 2,
        originalPrice: 12,
        pricePerUnit: '$1/unit',
        link: 'http://example.com/product-x',
        image: 'http://example.com/product-x.jpg',
      });

      const updatedProduct = await productService.updateProduct(
        existingProduct._id,
        {
          name: 'Product X',
          brand: 'Brand X',
          price: 15,
          savings: 3,
          originalPrice: 18,
          pricePerUnit: '$1.5/unit',
          link: 'http://example.com/product-x',
          image: 'http://example.com/product-x.jpg',
        }
      );

      expect(updatedProduct.name).toBe('Product X');
      expect(updatedProduct.brand).toBe('Brand X');
      expect(updatedProduct.price).toBe(15);
      expect(updatedProduct.savings).toBe(3);
      expect(updatedProduct.originalPrice).toBe(18);
      expect(updatedProduct.pricePerUnit).toBe('$1.5/unit');
      expect(updatedProduct.link).toBe('http://example.com/product-x');
      expect(updatedProduct.image).toBe('http://example.com/product-x.jpg');
      expect(updatedProduct.priceHistory).toHaveLength(2);
    });
  });

  describe('deleteProduct', () => {
    test('should delete an existing product', async () => {
      const product = await productService.createProduct({
        name: 'Product to Delete',
        price: 10,
        brand: 'Brand F',
        savings: 2,
        originalPrice: 12,
        pricePerUnit: '$1/unit',
        link: 'http://example.com/delete',
        image: 'http://example.com/delete.jpg',
      });
      const result = await productService.deleteProduct(product._id);
      expect(result.message).toBe('Product successfully deleted');
      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    test('should throw NotFoundError when deleting non-existent product', async () => {
      const productId = new mongoose.Types.ObjectId();
      await expect(productService.deleteProduct(productId)).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
