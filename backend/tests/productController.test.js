const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../src/app');
const { Product } = require('../src/models/Product');
const logger = require('../src/utils/logger');

describe('Product Controller', () => {
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

  describe('GET /api/products', () => {
    test('should return all products when no brand is specified', async () => {
      await Product.create([
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
          brand: 'Brand Y',
          price: 19.99,
          savings: 5.0,
          originalPrice: 24.99,
          pricePerUnit: '$19.99/kg',
          link: 'https://example.com/product2',
          image: 'https://example.com/product2.jpg',
        },
      ]);

      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body.totalProducts).toBe(2);
      expect(response.body.productsByBrand).toEqual({
        'Brand X': 1,
        'Brand Y': 1,
      });
      expect(response.body.products).toHaveLength(2);
    });

    test('should return filtered products when brand is specified', async () => {
      await Product.create([
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
          brand: 'Brand Y',
          price: 19.99,
          savings: 5.0,
          originalPrice: 24.99,
          pricePerUnit: '$19.99/kg',
          link: 'https://example.com/product2',
          image: 'https://example.com/product2.jpg',
        },
      ]);

      const response = await request(app).get('/api/products?brand=Brand X');
      expect(response.status).toBe(200);
      expect(response.body.totalProducts).toBe(1);
      expect(response.body.productsByBrand).toEqual({ 'Brand X': 1 });
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toBe('Product 1');
    });
  });

  describe('GET /api/products/:id', () => {
    test('should return a product when valid id is provided', async () => {
      const product = await Product.create({
        name: 'Product 1',
        brand: 'Brand X',
        price: 9.99,
        savings: 2.0,
        originalPrice: 11.99,
        pricePerUnit: '$9.99/kg',
        link: 'https://example.com/product1',
        image: 'https://example.com/product1.jpg',
      });

      const response = await request(app).get(`/api/products/${product._id}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Product 1');
    });

    test('should return 404 when product is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/products/${nonExistentId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/products', () => {
    test('should create a new product', async () => {
      const newProduct = {
        name: 'New Product',
        brand: 'New Brand',
        price: 15,
        savings: 5,
        originalPrice: 20,
        pricePerUnit: '$1.5/unit',
        link: 'http://example.com/new-product',
        image: 'http://example.com/new-product.jpg',
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Product successfully created');
      expect(response.body.product.name).toBe('New Product');
    });

    test('should return 400 for invalid product data', async () => {
      const invalidProduct = { name: '' };
      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/products/:id', () => {
    test('should update an existing product', async () => {
      const product = await Product.create({
        name: 'Product X',
        brand: 'Brand X',
        price: 10,
        savings: 2,
        originalPrice: 12,
        pricePerUnit: '$1/unit',
        link: 'http://example.com/product-x',
        image: 'http://example.com/product-x.jpg',
      });

      const updatedData = {
        name: 'Product X',
        brand: 'Brand X',
        price: 15,
        savings: 3,
        originalPrice: 18,
        pricePerUnit: '$1.5/unit',
        link: 'http://example.com/product-x',
        image: 'http://example.com/product-x.jpg',
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product successfully updated');
      expect(response.body.product.name).toBe('Product X');
      expect(response.body.product.price).toBe(15);
    });

    test('should return 404 when updating non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/products/${nonExistentId}`)
        .send({
          name: 'Product X',
          brand: 'Brand X',
          price: 15,
          savings: 3,
          originalPrice: 18,
          pricePerUnit: '$1.5/unit',
          link: 'http://example.com/product-x',
          image: 'http://example.com/product-x.jpg',
        });
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    test('should delete an existing product', async () => {
      const product = await Product.create({
        name: 'Product X',
        brand: 'Brand X',
        price: 10,
        savings: 2,
        originalPrice: 12,
        pricePerUnit: '$1/unit',
        link: 'http://example.com/product-x',
        image: 'http://example.com/product-x.jpg',
      });

      const response = await request(app).delete(
        `/api/products/${product._id}`
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product successfully deleted');

      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    test('should return 404 when deleting non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(
        `/api/products/${nonExistentId}`
      );
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/products/bulk', () => {
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
          brand: 'Brand Y',
          price: 19.99,
          savings: 5.0,
          originalPrice: 24.99,
          pricePerUnit: '$19.99/kg',
          link: 'https://example.com/product2',
          image: 'https://example.com/product2.jpg',
        },
      ];

      const response = await request(app)
        .post('/api/products/bulk')
        .send({ products });
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Products successfully saved');
      expect(response.body.savedProducts).toHaveLength(2);
    });

    test('should return 400 for invalid products data', async () => {
      const response = await request(app)
        .post('/api/products/bulk')
        .send({ products: [] });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/products/:id/price-history', () => {
    test('should return price history for a product', async () => {
      const response = await request(app).post('/api/products').send({
        name: 'New Product',
        brand: 'New Brand',
        price: 15,
        savings: 5,
        originalPrice: 20,
        pricePerUnit: '$1.5/unit',
        link: 'http://example.com/new-product',
        image: 'http://example.com/new-product.jpg',
      });

      const productId = response.body.product._id;
      const priceHistory = await request(app).get(
        `/api/products/${productId}/price-history`
      );
      expect(priceHistory.status).toBe(200);
      expect(priceHistory.body[0].price).toBe(15);
      expect(priceHistory.body[0].savings).toBe(5);
      expect(priceHistory.body[0].originalPrice).toBe(20);
      expect(priceHistory.body[0].pricePerUnit).toBe('$1.5/unit');
    });

    test('should return 404 when product is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/api/products/${nonExistentId}/price-history`
      );
      expect(response.status).toBe(404);
    });
  });
});
