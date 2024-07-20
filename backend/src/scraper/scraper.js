const retry = require("async-retry");
const { chromium } = require("playwright");
const config = require("../config/playwright.config");
const logger = require("../logger");
const productService = require("../services/productService");

function getRandomUserAgent() {
  const userAgents = config.projects.map((project) => project.use.userAgent);
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function scrapeWoolies(page) {
  const productsLocator = page.locator(".product-tile-image a");
  await productsLocator.first().waitFor({ state: "visible" });

  const productsHandle = await productsLocator.elementHandles();

  const products = await Promise.all(
    productsHandle.map(async (element) => {
      const ariaLabel = await element.getAttribute("aria-label");
      const link = await element.getAttribute("href");
      const image = await element.$eval("img", (img) =>
        img.getAttribute("src")
      );
      return createProductDetails(ariaLabel, link, image);
    })
  );

  return products;
}

async function getLastPageNumber(page) {
  const count = await page.locator(".paging-pageNumber").count();
  const lastPageElem = await page.locator(".paging-pageNumber").nth(count - 1);
  const lastPage = (await lastPageElem.textContent())
    .replace("Page", "")
    .trim();
  return lastPage;
}

function createProductDetails(ariaLabel, link, image) {
  const parts = (ariaLabel ?? "").split(". ");
  const { name, price, pricePerUnit } = extractProductInfo(parts);
  const amountSaved = extractAmountSaved(parts);

  // TODO: Add class="rating"
  return {
    productName: name,
    salePrice: price,
    amountSaved: amountSaved,
    pricePerUnit: pricePerUnit || null,
    productLink: link || null,
    productImage: image || null,
  };
}

function extractProductInfo(parts) {
  const [namePart, pricePart, pricePerUnitPart] = (parts[3] ?? "").split(",");
  const pricePerUnit = (pricePerUnitPart ?? "").slice(0, -1);
  return {
    name: namePart ? namePart.trim() : null,
    price: pricePart ? pricePart.trim() : null,
    pricePerUnit: pricePerUnit ? pricePerUnit.trim() : null,
  };
}

function extractAmountSaved(parts) {
  const amountSavedPart = parts.find((part) => part.startsWith("Save"));

  return amountSavedPart
    ? amountSavedPart.match(/\$\d?\d+.+/)?.[0] || null
    : null;
}

async function scrape() {
  const randomUserAgent = getRandomUserAgent();
  const browser = await chromium.launch({ headless: false });
  logger.info("Browser launched");

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    http2: false,
    userAgent: randomUserAgent,
    extraHTTPHeaders: {
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  const page = await context.newPage();

  const url = `${config.use.baseURL}?pageNumber=1`;

  await page.goto(url);

  const lastPage = await getLastPageNumber(page);

  // Scrape products per page
  for (let currentPage = 1; currentPage <= lastPage; currentPage++) {
    const url = `${config.use.baseURL}?pageNumber=${currentPage}`;
    await page.goto(url);
    try {
      logger.info(`Scraping ${url}`);
      const products = await scrapeWoolies(page);
      await productService.saveProducts(products);
    } catch (error) {
      logger.error("Error during navigation or scraping:", error);
    }
  }

  await browser.close();
}

module.exports = {
  scrape,
  createProductDetails,
};
