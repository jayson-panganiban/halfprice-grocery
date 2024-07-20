# Half Price Backend

## Overview
This is the backend service for the Half-Price project, which provides APIs to manage half-price products. It also includes a web scraper for collecting and updating product data.


## Getting Started
1. Clone the repository:
```git clone https://github.com/jayson-panganiban/half-price.git```
2. Go to backend folder
```cd half-price/backend```

3. Install dependencies:
```npm install``` 
1. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables (e.g., `PORT`, `MONGODB_URI`, `NODE_ENV`)

2. Start the server:
```npm start```

## Project Structure

- `src/`: Contains the main application code
  - `config/`: Configuration files
  - `services/`: Business logic
  - `models/`: Database models
  - `routes/`: API routes
- `tests/`: Contains test files
- `server.js`: Main server file

## Technologies Used

- Express.js
- MongoDB with Mongoose
- Winston for logging
- Jest for testing
- Playwright for web scraping
- Helmet for security
 
## API Endpoints

Get all products:
```curl http://localhost:3000/api/products```

Create a new product:
```
curl -X POST -H "Content-Type: application/json" -d '{"productName":"Test Product","salePrice":"$9.99","amountSaved":"$2.00"}' http://localhost:3000/api/products
```

Get specific product by ID:
```curl http://localhost:3000/api/products/[product_id]```

Update a product
```curl -X PUT -H "Content-Type: application/json" -d '{"salePrice":"$8.99"}' http://localhost:3000/api/products/[product_id]```

Delete a product
```curl -X DELETE http://localhost:3000/api/products/[product_id]```

Run the scraper:
```curl -X POST http://localhost:3000/api/scraper```

### Running Tests
To run all tests:
```npm run test```

### Running API Tests
To run all API tests:
```npm run test:api```