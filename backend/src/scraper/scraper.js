const { chromium } = require("playwright");
const { expect } = require("@playwright/test")
const config = require("../config/playwright.config");
const logger = require("../logger");
const productService = require("../services/productService");

class Scraper {
  constructor(brand) {
    this.brand = brand;
    this.config = config[brand];
  }

  async initialize() {
    this.browser = await chromium.launch({ headless: false });
    logger.info(`Browser launched for ${this.brand}`);

    this.context = await this.browser.newContext({
      ignoreHTTPSErrors: true,
      http2: false,
      userAgent: this.getRandomUserAgent(),
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    this.page = await this.context.newPage();
  }

  getRandomUserAgent() {
    return config.use.userAgents[
      Math.floor(Math.random() * config.use.userAgents.length)
    ];
  }

  async getLastPageNumber() {
    const paginationElement = this.page
    .locator(this.config.selectors.pagination);
    await expect(paginationElement.first()).toBeVisible();
    const count = await paginationElement.count();
    const lastPageElement = paginationElement.nth(count - 1);
    const lastPageNumber = (await lastPageElement.textContent())
      .replace("Page", "")
      .trim();
    return lastPageNumber;
  }

  async scrapeProducts() {
    const productsLocator = this.page.locator(
      this.config.selectors.productTile
    );
    await productsLocator.first().waitFor({ state: "visible" });
    const productsHandle = await productsLocator.elementHandles();

    return Promise.all(
      productsHandle.map(async (element) => {
        const ariaLabel = await element.getAttribute("aria-label");
        const link = await element.getAttribute("href");
        const image = await element.$eval("img", (img) =>
          img.getAttribute("src")
        );
        return this.createProductDetails(ariaLabel, link, image);
      })
    );
  }

  createProductDetails(ariaLabel, link, image) {
    const parts = (ariaLabel ?? "").split(". ");
    const { name, price, pricePerUnit } = this.extractProductInfo(parts);
    const amountSaved = this.extractAmountSaved(parts);

    return {
      productName: name,
      salePrice: price,
      amountSaved: amountSaved,
      pricePerUnit: pricePerUnit || null,
      productLink: link || null,
      productImage: image || null,
    };
  }

  extractProductInfo(parts) {
    const [namePart, pricePart, pricePerUnitPart] = (parts[3] ?? "").split(",");
    return {
      name: namePart ? namePart.trim() : null,
      price: pricePart ? pricePart.trim() : null,
      pricePerUnit: pricePerUnitPart
        ? pricePerUnitPart.slice(0, -1).trim()
        : null,
    };
  }

  extractAmountSaved(parts) {
    const amountSavedPart = parts.find((part) => part.startsWith("Save"));
    return amountSavedPart
      ? amountSavedPart.match(/\$\d?\d+.+/)?.[0] || null
      : null;
  }

  async scrape() {
    await this.initialize();

    try {
      await this.page.goto(`${this.config.baseURL}?pageNumber=1`);
      const lastPage = await this.getLastPageNumber();

      for (let currentPage = 1; currentPage <= lastPage; currentPage++) {
        const url = `${this.config.baseURL}?pageNumber=${currentPage}`;
        await this.page.goto(url);

        logger.info(`Scraping ${url}`);
        const products = await this.scrapeProducts();
        await productService.saveProducts(products);
      }
    } catch (error) {
      logger.error(`Error during scraping ${this.brand}:`, error);
    } finally {
      await this.browser.close();
    }
  }
}

const scrapers = {
  woolworths: new Scraper("woolworths"),
  // Add more scrapers here as needed
};

async function scrapeAll() {
  for (const [brand, scraper] of Object.entries(scrapers)) {
    logger.info(`Starting scrape for ${brand}`);
    await scraper.scrape();
  }
}

module.exports = {
  scrapeAll,
  Scraper,
};
