import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProducts = async (brand = "") => {
  try {
    const response = await api.get("/products", { params: { brand } });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const [colesProducts, wooliesProducts] = await Promise.all([
      getProducts("Coles"),
      getProducts("Woolies"),
    ]);
    return [...colesProducts.products, ...wooliesProducts.products];
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

export default api;
