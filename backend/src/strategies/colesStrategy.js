const config = require("../config/playwright.config");
const logger = require("../utils/logger");
const productService = require("../services/productService");

class ColesStrategy {
  async execute(page) {
    await page.goto(`${config.coles.baseURL}/half-price-specials`);
    const products = await this.scrapeProducts(page);
    logger.info(`Products found: ${products.length}`);
    await productService.saveProducts(products, "Coles");
  }

  async scrapeProducts(page) {
    const selector = config.coles.selectors.productTile;
    await page.waitForSelector(selector, { state: "visible" });
    const productsLocator = page.locator(selector);

    await this.loadAllProducts(page);

    const baseURL = config.coles.baseURL;

    return productsLocator.evaluateAll(
      (elements, baseURL) =>
        elements.map((el) => ({
          name:
            el.querySelector(".product__title")?.textContent?.trim() || null,
          price:
            el
              .querySelector(".price__value[data-testid='product-pricing']")
              ?.textContent?.trim() || null,
          pricePerUnit:
            el
              .querySelector(".price__calculation_method")
              ?.textContent?.trim()
              .split("|")[0]
              .trim() || null,
          image: el.querySelector("img")?.getAttribute("src") || null,
          link:
            `${baseURL}${el.querySelector("a")?.getAttribute("href")}` || null,
          brand: "Coles",
        })),
      baseURL
    );
  }

  async loadAllProducts(page) {
    const loadMoreBtn = page.locator("button[data-testid='load-more-button']");
    while ((await loadMoreBtn.count) > 0) {
      await loadMoreBtn.click();
      await page.waitForTimeout(config.coles.loadMoreDelay);
    }
  }
}

module.exports = new ColesStrategy();
