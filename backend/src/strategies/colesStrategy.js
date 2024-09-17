const config = require('../config/scraper');
const productService = require('../services/productService');
const logger = require('../utils/logger');

class ColesStrategy {
  constructor() {
    this.baseURL = config.coles.baseURL;
  }

  async execute(page) {
    await page.goto(`${this.baseURL}/half-price-specials`);
    const products = await this.scrapeProducts(page);
    await productService.saveProducts(products);
  }

  async scrapeProducts(page) {
    const selector = config.coles.selectors.productTile;
    await page.waitForSelector(selector, { state: 'visible' });

    await this.loadAllProducts(page);

    const productsLocator = page.locator(selector);

    const products = await productsLocator.evaluateAll(
      this.mapProductData,
      this.baseURL
    );

    return products;
  }

  mapProductData(elements, baseURL) {
    return elements.map((el) => {
      const getTextContent = (selector) =>
        el.querySelector(selector)?.textContent?.trim() ?? null;
      const getAttributeValue = (selector, attr) =>
        el.querySelector(selector)?.getAttribute(attr) ?? null;

      const name = (
        getAttributeValue('.product__image_area a', 'aria-label') || ''
      )
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");

      const priceText = getTextContent(
        ".price__value[data-testid='product-pricing']"
      )?.replace('$', '');
      const price = priceText ? Number(parseFloat(priceText).toFixed(2)) : null;

      const savingsText = getTextContent('.badge-label');
      const savings = savingsText
        ? Number(parseFloat(savingsText.replace(/[^0-9.]/g, '')).toFixed(2))
        : null;

      const originalPriceText = getTextContent('.price__was');
      const originalPrice = originalPriceText
        ? Number(
            parseFloat(originalPriceText.replace(/[^0-9.]/g, '')).toFixed(2)
          )
        : null;

      return {
        name: name,
        brand: 'Coles',
        price: price,
        savings: savings,
        originalPrice: originalPrice,
        pricePerUnit:
          getTextContent('.price__calculation_method')?.split('|')[0].trim() ??
          null,
        image: getAttributeValue('img', 'src'),
        link: getAttributeValue('a', 'href')
          ? `${baseURL}${getAttributeValue('a', 'href')}`
          : null,
      };
    });
  }

  async loadAllProducts(page) {
    const loadMoreBtn = page.locator("button[data-testid='load-more-button']");
    while ((await loadMoreBtn.count()) > 0) {
      await loadMoreBtn.click();
      await page.waitForTimeout(config.coles.loadMoreDelay);
    }
  }
}

module.exports = new ColesStrategy();
