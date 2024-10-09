# 🛒 HalfPrice Grocery Backend

[![GitHub](https://img.shields.io/badge/GitHub-HalfPrice_Grocery-blue?style=for-the-badge&logo=github)](https://github.com/jayson-panganiban/halfprice-grocery)

## 📋 Overview

This backend service is part of the halfprice-grocery project repository. It manages half-price product information from Australian supermarkets, providing APIs for accessing product data and including a web scraper to collect the latest deals. It's built with Node.js, Express, and MongoDB.

## 🛠️ Features

🕷️ Scraper Service
🗂️ Category Service
📦 Product Management
💾 Data Model

## 🔗 API Endpoints

- `GET /api/products`: Get all products
- `GET /api/products?brand=brandName`: Get products by brand
- `GET /api/products/weekly`: Get weekly products
- `GET /api/products/weekly?brand=brandName`: Get weekly products by brand
- `GET /api/products/categorized`: Get categorized products
- `GET /api/products/categorized?brand=brandName&category=categoryName&weekly=true/false`: Get categorized products with optional filters
- `GET /api/products/by-name?name=productName`: Get product by name
- `GET /api/products/:id`: Get product by ID
- `GET /api/products/:id/price-history`: Get price history for a product
- `POST /api/products`: Create a new product
- `POST /api/products/bulk`: Save multiple products
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

## 🛠️ Technologies Used

- Express.js: Web application framework
- MongoDB with Mongoose: Database and ORM
- Winston: Logging
- Jest: Testing framework
- Playwright: Web scraping
- Helmet: Security middleware
- Moment.js: Date manipulation
- Joi: Data validation

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/jayson-panganiban/halfprice-grocery.git
   ```

2. Go to the backend folder

   ```bash
   cd halfprice-grocery/backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add necessary environment variables

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=dev
   ```

5. Start the server:
   `npm start`

## 🧪 Testing

To run all tests:

```bash
npm test
```

## 📄 License

This project is licensed under the MIT License.
