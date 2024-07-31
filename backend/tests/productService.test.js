const mongoose = require("mongoose");
const connectDB = require("../src/config/database");
const productService = require("../src/services/productService");
const Product = require("../src/models/Product");

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

  test("should save products to the database", async () => {
    const testProducts = [
      {
        name: "Test Product 1",
        price: "$10",
        pricePerUnit: "$2/kg",
        link: "/test-product-1",
        image: "test1.jpg",
      },
      {
        name: "Test Product 2",
        price: "$20",
        pricePerUnit: "$4/kg",
        link: "/test-product-2",
        image: "test2.jpg",
      },
    ];

    const brand = "Test Brand";

    const savedProducts = await productService.saveProducts(
      testProducts,
      brand
    );
    expect(savedProducts).toHaveLength(2);
    expect(savedProducts[0].name).toBe("Test Product 1");
    expect(savedProducts[0].brand).toBe("Test Brand");
    expect(savedProducts[1].name).toBe("Test Product 2");
    expect(savedProducts[1].brand).toBe("Test Brand");
  });

  test("should not create duplicate products", async () => {
    const testProduct = {
      name: "Duplicate Test Product",
      price: "$25",
      pricePerUnit: "$5/kg",
      link: "/duplicate-test-product",
      image: "duplicate.jpg",
      brand: "Test Brand",
    };

    const initialProduct = await productService.createProduct(testProduct);

    const duplicateProduct = await productService.createProduct(testProduct);

    const allProducts = await productService.getProducts();
    expect(allProducts).toHaveLength(1);
    expect(allProducts[0].name).toBe("Duplicate Test Product");

    expect(duplicateProduct._id.toString()).toBe(initialProduct._id.toString());
  });

  test("should not create product with empty name", async () => {
    const testProduct = {
      name: "",
      price: "$15",
      pricePerUnit: "$3/kg",
      link: "/test-product",
      image: "test.jpg",
      brand: "Test Brand",
    };

    const result = await productService.createProduct(testProduct);
    expect(result).toBeNull();

    const allProducts = await productService.getProducts();
    expect(allProducts).toHaveLength(0);
  });

  test("should retrieve products from the database", async () => {
    const testProduct = {
      name: "Test Product",
      price: "$15",
      pricePerUnit: "$3/kg",
      link: "/test-product",
      image: "test.jpg",
      brand: "Test Brand",
    };

    await productService.createProduct(testProduct);

    const retrievedProducts = await productService.getProducts();
    expect(retrievedProducts).toHaveLength(1);
    expect(retrievedProducts[0].name).toBe("Test Product");
  });

  test("should modify an existing product", async () => {
    const initialProduct = {
      name: "Initial Product",
      price: "$10",
      pricePerUnit: "$5/kg",
      link: "/initial-product",
      image: "initial.jpg",
      brand: "Test Brand",
    };
    const savedProduct = await productService.createProduct(initialProduct);
    const productId = savedProduct._id;

    const updatedData = {
      name: "Updated Product",
      price: "$12",
    };
    const updatedProduct = await productService.updateProduct(
      productId,
      updatedData
    );

    expect(updatedProduct.name).toBe("Updated Product");
    expect(updatedProduct.price).toBe("$12");
    expect(updatedProduct.pricePerUnit).toBe("$5/kg");
  });

  test("should delete an existing product", async () => {
    const productToDelete = {
      name: "Product to Delete",
      price: "$15",
      pricePerUnit: "$7.5/kg",
      link: "/delete-product",
      image: "delete.jpg",
      brand: "Test Brand",
    };
    const savedProduct = await productService.createProduct(productToDelete);
    const productId = savedProduct._id;

    const result = await productService.deleteProduct(productId);
    expect(result).toEqual({ message: "Product successfully deleted" });

    const deletedProduct = await Product.findById(productId);
    expect(deletedProduct).toBeNull();
  });
});
