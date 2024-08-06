const axios = require("axios");
const config = require("../src/config/environment");
const logger = require("../src/utils/logger");

const API_URL = `http://localhost:${config.PORT}/api`;

describe("Test API Endpoints", () => {
  let createdProductId;

  test("POST /products - Create a new product", async () => {
    const newProduct = {
      name: "Test Product",
      price: "$15",
      pricePerUnit: "$3/kg",
      link: "/test-product",
      image: "test.jpg",
      brand: "Test Brand",
    };

    const response = await axios.post(`${API_URL}/products`, newProduct);
    expect(response.status).toBe(201);
    expect(response.data.message).toBe("Product successfully created");
    expect(response.data.product.name).toBe(newProduct.name);
    createdProductId = response.data.product._id;
  });

  test("PUT /products/:id - Update a product", async () => {
    const updatedData = {
      name: "Test Product",
      price: "$20",
    };

    const response = await axios.put(
      `${API_URL}/products/${createdProductId}`,
      updatedData
    );
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Product successfully updated");
    expect(response.data.product.name).toBe(updatedData.name);
    expect(response.data.product.price).toBe(updatedData.price);
  });

  test("GET /products - Fetch all products and verify response structure", async () => {
    const response = await axios.get(`${API_URL}/products`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("totalProducts");
    expect(response.data).toHaveProperty("productsByBrand");
    expect(response.data).toHaveProperty("products");
  });

  test("GET /products/:id - Fetch a specific product by Id", async () => {
    const response = await axios.get(`${API_URL}/products/${createdProductId}`);
    expect(response.status).toBe(200);
    expect(response.data._id).toBe(createdProductId);
  });

  test("GET /products?brand - Fetch products by brand", async () => {
    const brand = "Test Brand";
    const response = await axios.get(
      `${API_URL}/products?brand=${encodeURIComponent(brand)}`
    );
    expect(response.status).toBe(200);
    expect(
      response.data.products.every((product) => product.brand === brand)
    ).toBe(true);
  });

  test("GET /products/:id/price-history - Fetch price history for a product", async () => {
    const response = await axios.get(
      `${API_URL}/products/${createdProductId}/price-history`
    );
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  test("DELETE /products/:id - Delete a product", async () => {
    const response = await axios.delete(
      `${API_URL}/products/${createdProductId}`
    );
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Product successfully deleted");
  });

  test("GET /products/:id - Verify product is deleted", async () => {
    await expect(
      axios.get(`${API_URL}/products/${createdProductId}`)
    ).rejects.toThrow("Request failed with status code 404");
  });

  // Error handling
  test("Bad Request - Get invalid product id", async () => {
    const invalidProductId = "invalidProductId";
    try {
      await axios.get(`${API_URL}/products/${invalidProductId}`);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        status: "fail",
        message: `Invalid product ID: ${invalidProductId}`,
      });
    }
  });

  test("Bad Request - Create with invalid fields", async () => {
    const invalidProduct = {
      name: "Product",
      invalidField: "This should cause an error",
      anotherInvalidField: "Another invalid field",
    };
    try {
      await axios.post(`${API_URL}/products`, invalidProduct);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        status: "fail",
        message: "Invalid field(s): invalidField, anotherInvalidField",
      });
    }
  });

  test("Bad Request - Create with empty payload", async () => {
    const emptyPayload = {};
    try {
      await axios.post(`${API_URL}/products`, emptyPayload);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        status: "fail",
        message: "Empty payload: product data is required",
      });
    }
  });

  test("Bad Request - Update with invalid fields", async () => {
    const invalidPayload = {
      names: "Test Product",
      price: "$10",
      pricePerUnit: "$2/kg",
      link: "/test-product",
      image: "test.jpg",
      brand: "Test Brand",
    };
    try {
      await axios.put(
        `${API_URL}/products/${createdProductId}`,
        invalidPayload
      );
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        status: "fail",
        message: "Invalid field(s): names",
      });
    }
  });

  test("Bad Request - Update with empty payload", async () => {
    const emptyPayload = {};
    try {
      await axios.put(`${API_URL}/products/${createdProductId}`, emptyPayload);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toEqual({
        status: "fail",
        message: "Empty payload: product data is required",
      });
    }
  });

  test("Not Found - Get non-existent product", async () => {
    const nonExistentProductId = "60f1a5b5d5e5e5e5e5e5e5e5";
    try {
      await axios.get(`${API_URL}/products/${nonExistentProductId}`);
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toEqual({
        status: "fail",
        message: `Product with id ${nonExistentProductId} not found`,
      });
    }
  });
});
