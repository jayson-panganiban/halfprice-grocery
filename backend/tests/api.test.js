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

  test("GET /products - Fetch all products", async () => {
    const response = await axios.get(`${API_URL}/products`);
    expect(response.status).toBe(200);
  });

  test("GET /products/:id - Fetch a specific product", async () => {
    const response = await axios.get(`${API_URL}/products/${createdProductId}`);
    expect(response.status).toBe(200);
    expect(response.data._id).toBe(createdProductId);
  });

  test("PUT /products/:id - Update a product", async () => {
    const updatedData = {
      name: "Updated Test Product",
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
});
