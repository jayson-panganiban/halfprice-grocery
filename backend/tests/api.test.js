const axios = require("axios");
const logger = require("../src/logger");
const config = require("../src/config/environment");

const API_URL = `http://localhost:${config.PORT}/api`;

describe("Test API Endpoints", () => {
  let createdProductId;

  test("POST /products - Create a new product", async () => {
    const newProduct = {
      productName: "Test Product",
      salePrice: "$15",
      amountSaved: "$5",
      pricePerUnit: "$3/kg",
      productLink: "/test-product",
      productImage: "test.jpg",
    };

    const response = await axios.post(`${API_URL}/products`, newProduct);
    expect(response.status).toBe(201);
    expect(response.data.productName).toBe(newProduct.productName);
    createdProductId = response.data._id;
  });

  test("GET /products - Fetch all products", async () => {
    const response = await axios.get(`${API_URL}/products`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBeTruthy();
    expect(response.data.length).toBeGreaterThan(0);
  });

  test("GET /products/:id - Fetch a specific product", async () => {
    const response = await axios.get(`${API_URL}/products/${createdProductId}`);
    expect(response.status).toBe(200);
    expect(response.data._id).toBe(createdProductId);
  });

  test("PUT /products/:id - Update a product", async () => {
    const updatedData = {
      productName: "Updated Test Product",
      salePrice: "$20",
    };

    const response = await axios.put(
      `${API_URL}/products/${createdProductId}`,
      updatedData
    );
    expect(response.status).toBe(200);
    expect(response.data.productName).toBe(updatedData.productName);
    expect(response.data.salePrice).toBe(updatedData.salePrice);
  });

  test("DELETE /products/:id - Delete a product", async () => {
    const response = await axios.delete(
      `${API_URL}/products/${createdProductId}`
    );
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Product deleted successfully");
  });

  test("GET /products/:id - Verify product is deleted", async () => {
    await expect(
      axios.get(`${API_URL}/products/${createdProductId}`)
    ).rejects.toThrow("Request failed with status code 404");
  });
});
