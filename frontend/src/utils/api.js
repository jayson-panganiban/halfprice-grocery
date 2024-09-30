import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3003/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/products${queryParams ? `?${queryParams}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getWeeklyProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/products/weekly${queryParams ? `?${queryParams}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getCategorizedProducts = async (brand, category) => {
  try {
    const params = new URLSearchParams({ brand, category, weekly: true });
    const url = `/products/categorized?${params.toString()}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching categorized products:', error);
    throw error;
  }
};

export const getLatestScrapeDate = async () => {
  try {
    const response = await api.get('/latest-scrape-date');
    return response.data.latestDate;
  } catch (error) {
    console.error('Error fetching latest scrape date:', error);
    throw error;
  }
};

export default api;
