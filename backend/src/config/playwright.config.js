const { devices } = require("@playwright/test");

const config = {
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: [["html", { outputFolder: "playwright-report" }]],
  use: {
    browserName: "chromium",
    userAgents: [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
      "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
    ],
  },
  woolworths: {
    baseURL: "https://www.woolworths.com.au/shop/browse/specials/half-price",
    selectors: {
      pagination: ".paging-pageNumber",
      productTile: ".product-tile-image a",
    },
  },
  coles: {
    baseURL: "https://www.coles.com.au/half-price-specials",
    selectors: {
      productTile: '[data-testid="product-tile"]',
    },
  },
};

module.exports = config;
