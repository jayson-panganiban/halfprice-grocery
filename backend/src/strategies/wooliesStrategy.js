const config = require("../config/playwright.config");
const logger = require("../utils/logger");
const productService = require("../services/productService");

class WooliesStrategy {
  async execute(page) {
    const baseUrl = `${config.woolies.baseURL}/shop/browse/specials/half-price`;
    await page.goto(baseUrl);
    const lastPage = await this.getLastPageNumber(page);

    for (let currentPage = 1; currentPage <= lastPage; currentPage++) {
      await this.scrapePage(page, currentPage, baseUrl);
    }

    logger.info(`Scraped ${lastPage} pages from Woolies`);
  }

  async getLastPageNumber(page) {
    const count = await page.locator(".paging-pageNumber").count();
    const lastPageElem = await page
      .locator(".paging-pageNumber")
      .nth(count - 1);
    return (await lastPageElem.textContent()).replace("Page", "").trim();
  }

  async scrapePage(page, pageNumber, baseUrl) {
    const url = `${baseUrl}?pageNumber=${pageNumber}`;
    await page.goto(url);

    try {
      logger.info(`Scraping ${url}`);
      const products = await this.scrapeProducts(page);
      await productService.saveProducts(products, "Woolies");
    } catch (error) {
      logger.error(`Error scraping page ${pageNumber}:`, error);
    }
  }

  async scrapeProducts(page) {
    const selector = config.woolies.selectors.productTile;
    const productsLocator = page.locator(selector);
    await productsLocator.first().waitFor({ state: "visible" });

    const productsHandle = await productsLocator.elementHandles();

    const products = await Promise.all(
      productsHandle.map(async (element) => {
        const ariaLabel = await element.getAttribute("aria-label");
        const link = await element.getAttribute("href");
        const image = await element.$eval("img", (img) =>
          img.getAttribute("src")
        );
        return this.createProductDetails(ariaLabel, link, image);
      })
    );

    return products;
  }

  createProductDetails(ariaLabel, link, image) {
    const parts = (ariaLabel ?? "").split(". ");
    const { name, price, pricePerUnit } = this.extractProductInfo(parts);

    return {
      name: name,
      price: price,
      pricePerUnit: pricePerUnit ?? null,
      link: link ? `${config.woolies.baseURL}${link}` : null,
      image: image ?? null,
      brand: "Woolies",
    };
  }

  extractProductInfo(parts) {
    const [namePart, pricePart, pricePerUnitPart] = (parts[3] ?? "").split(",");
    if (namePart == null || namePart == "") {
      logger.info(`Product is not half price: ${parts}`);
    }

    const pricePerUnit = (pricePerUnitPart ?? "").slice(0, -1);
    return {
      name: namePart ? namePart.trim() : null,
      price: pricePart ? pricePart.trim() : null,
      pricePerUnit: pricePerUnit ? pricePerUnit.trim() : null,
    };
  }
}

module.exports = new WooliesStrategy();
