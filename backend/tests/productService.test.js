const mongoose = require("mongoose");
const connectDB = require("../src/config/database");
const productService = require("../src/services/productService");
const Product = require("../src/models/Product");
const {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} = require("../src/utils/errors");
const logger = require("../src/utils/logger");

describe("Product Service", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe("createProduct", () => {
    test("should create a new product with price history", async () => {
      const testProduct = {
        name: "Test Product",
        price: "$10",
        pricePerUnit: "$2/kg",
        link: "/test-product",
        image: "test.jpg",
        brand: "Test Brand",
      };

      const savedProduct = await productService.createProduct(testProduct);
      expect(savedProduct.name).toBe("Test Product");
      expect(savedProduct.price).toBe("$10");
      expect(savedProduct.priceHistory).toHaveLength(1);
      expect(savedProduct.priceHistory[0].price).toBe("$10");
      expect(savedProduct.priceHistory[0].pricePerUnit).toBe("$2/kg");
    });
  });

  describe("updateProduct", () => {
    test("should update product and add to price history when price changes", async () => {
      const initialProduct = await productService.createProduct({
        name: "Initial Product",
        price: "$10",
        pricePerUnit: "$5/kg",
        brand: "Test Brand",
      });

      const updatedProduct = await productService.updateProduct(
        initialProduct._id,
        {
          price: "$12",
          pricePerUnit: "$6/kg",
        }
      );

      expect(updatedProduct.price).toBe("$12");
      expect(updatedProduct.pricePerUnit).toBe("$6/kg");
      expect(updatedProduct.priceHistory).toHaveLength(2);
      expect(updatedProduct.version).toBe(2);
    });

    test("should not add to price history when price doesn't change", async () => {
      const initialProduct = await productService.createProduct({
        name: "Updated Product",
        price: "$10",
        pricePerUnit: "$5/kg",
        brand: "Test Brand",
      });

      const updatedProduct = await productService.updateProduct(
        initialProduct._id,
        {
          name: "Updated Product",
          price: "$10",
          pricePerUnit: "$5/kg",
          brand: "Test Brand",
        }
      );

      expect(updatedProduct.name).toBe("Updated Product");
      expect(updatedProduct.priceHistory).toHaveLength(1);
      expect(updatedProduct.version).toBe(1);
    });
  });

  describe("getPriceHistory", () => {
    test("should return price history for a product", async () => {
      const testProduct = await productService.createProduct({
        name: "History Product",
        price: "$10",
        pricePerUnit: "$5/kg",
        brand: "Test Brand",
      });

      await productService.updateProduct(testProduct._id, {
        price: "$12",
        pricePerUnit: "$6/kg",
      });
      await productService.updateProduct(testProduct._id, {
        price: "$15",
        pricePerUnit: "$7.5/kg",
      });

      const priceHistory = await productService.getPriceHistory(
        testProduct._id
      );
      expect(priceHistory).toHaveLength(3);
      expect(priceHistory[2].price).toBe("$15");
      expect(priceHistory[2].pricePerUnit).toBe("$7.5/kg");
    });

    test("should throw NotFoundError for non-existent product ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(productService.getPriceHistory(fakeId)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("getProducts", () => {
    test("should fetch all products without brand filter", async () => {
      await productService.createProduct({
        name: "Product 1",
        brand: "Brand A",
      });
      await productService.createProduct({
        name: "Product 2",
        brand: "Brand B",
      });
      const products = await productService.getProducts();
      expect(products.length).toBe(2);
    });

    test("should fetch products with brand filter", async () => {
      await productService.createProduct({
        name: "Product 1",
        brand: "Brand A",
      });
      await productService.createProduct({
        name: "Product 2",
        brand: "Brand B",
      });
      const products = await productService.getProducts("Brand A");
      expect(products.length).toBe(1);
      expect(products[0].name).toBe("Product 1");
    });
  });

  describe("getProductById", () => {
    test("should fetch a product by valid ID", async () => {
      const createdProduct = await productService.createProduct({
        name: "Test Product",
        brand: "Test Brand",
      });
      const fetchedProduct = await productService.getProductById(
        createdProduct._id
      );
      expect(fetchedProduct.name).toBe("Test Product");
    });

    test("should throw NotFoundError for invalid product ID", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(productService.getProductById(fakeId)).rejects.toThrow(
        NotFoundError
      );
    });

    test("should throw BadRequestError for invalid product ID format", async () => {
      await expect(productService.getProductById("invalid-id")).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("saveProducts", () => {
    test("should save multiple products", async () => {
      const products = [
        { name: "Product 1", price: "$10" },
        { name: "Product 2", price: "$20" },
      ];
      const savedProducts = await productService.saveProducts(
        products,
        "Test Brand"
      );
      expect(savedProducts.length).toBe(2);
      expect(savedProducts[0].brand).toBe("Test Brand");
      expect(savedProducts[1].brand).toBe("Test Brand");
    });

    test("should handle error when saving products fails", async () => {
      jest
        .spyOn(Product.prototype, "save")
        .mockRejectedValueOnce(new Error("Database error"));
      const products = [{ name: "Product 1", price: "$10" }];
      await expect(
        productService.saveProducts(products, "Test Brand")
      ).rejects.toThrow(InternalServerError);
    });
  });

  describe("deleteProduct", () => {
    test("should delete an existing product", async () => {
      const createdProduct = await productService.createProduct({
        name: "To Be Deleted",
        brand: "Test brand",
      });
      const result = await productService.deleteProduct(createdProduct._id);
      expect(result.message).toBe("Product successfully deleted");
      await expect(
        productService.getProductById(createdProduct._id)
      ).rejects.toThrow(NotFoundError);
    });

    test("should throw NotFoundError when deleting non-existent product", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(productService.deleteProduct(fakeId)).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
