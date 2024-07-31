# Half Price Backend

## Overview

This is the backend service for the Half-Price project, which provides APIs to manage half-price products and includes a web scraper for collecting product data from major Australian supermarkets.

## Getting Started

1. Clone the repository:
   `git clone https://github.com/jayson-panganiban/half-price.git`

2. Go to the backend folder
   `cd half-price/backend`

3. Install dependencies:
   `npm install`

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

## API Endpoints

- `GET /api/products`: Get all products
- `GET /api/products?brand=brandName`: Get products by brand
- `GET /api/products/:id`: Get product by ID
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product
- `GET /api/scraper/:brand`: Run the scraper for a specific brand

## Running Tests

To run all tests:
`npm test`

## Technologies Used

- Express.js
- MongoDB with Mongoose
- Winston for logging
- Jest for testing
- Playwright for web scraping
- Helmet for security
