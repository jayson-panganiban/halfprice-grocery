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
        productName: "Test Product 1",
        salePrice: "$10",
        amountSaved: "$5",
        pricePerUnit: "$2/kg",
        productLink: "/test-product-1",
        productImage: "test1.jpg",
      },
      {
        productName: "Test Product 2",
        salePrice: "$20",
        amountSaved: "$10",
        pricePerUnit: "$4/kg",
        productLink: "/test-product-2",
        productImage: "test2.jpg",
      },
    ];

    const savedProducts = await productService.saveProducts(testProducts);
    expect(savedProducts).toHaveLength(2);
    expect(savedProducts[0].productName).toBe("Test Product 1");
    expect(savedProducts[1].productName).toBe("Test Product 2");
  });

  test("should retrieve products from the database", async () => {
    const testProduct = {
      productName: "Test Product",
      salePrice: "$15",
      amountSaved: "$7",
      pricePerUnit: "$3/kg",
      productLink: "/test-product",
      productImage: "test.jpg",
    };

    await productService.createProduct(testProduct);

    const retrievedProducts = await productService.getProducts();
    expect(retrievedProducts).toHaveLength(1);
    expect(retrievedProducts[0].productName).toBe("Test Product");
  });

  test("should modify an existing product", async () => {
    const initialProduct = {
      productName: "Initial Product",
      salePrice: "$10",
      amountSaved: "$2",
      pricePerUnit: "$5/kg",
      productLink: "/initial-product",
      productImage: "initial.jpg",
    };
    const savedProduct = await productService.createProduct(initialProduct);
    const productId = savedProduct._id;

    const updatedData = {
      productName: "Updated Product",
      salePrice: "$12",
    };
    const updatedProduct = await productService.updateProduct(
      productId,
      updatedData
    );

    expect(updatedProduct.productName).toBe("Updated Product");
    expect(updatedProduct.salePrice).toBe("$12");
    expect(updatedProduct.amountSaved).toBe("$2");
    expect(updatedProduct.pricePerUnit).toBe("$5/kg");
  });

  test("should delete an existing product", async () => {
    const productToDelete = {
      productName: "Product to Delete",
      salePrice: "$15",
      amountSaved: "$3",
      pricePerUnit: "$7.5/kg",
      productLink: "/delete-product",
      productImage: "delete.jpg",
    };
    const savedProduct = await productService.createProduct(productToDelete);
    const productId = savedProduct._id;

    await productService.deleteProduct(productId);

    const deletedProduct = await Product.findById(productId);
    expect(deletedProduct).toBeNull();
  });
});
