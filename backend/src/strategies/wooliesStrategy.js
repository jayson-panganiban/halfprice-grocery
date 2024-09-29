const config = require('../config/scraper');
const logger = require('../utils/logger');
const productService = require('../services/productService');

class WooliesStrategy {
  constructor() {
    this.baseURL = config.woolies.baseURL;
  }

  async execute(page) {
    const halfPriceUrl = `${this.baseURL}/shop/browse/specials/half-price`;
    await page.goto(halfPriceUrl);
    const lastPage = await this.getLastPageNumber(page);

    for (let currentPage = 1; currentPage <= lastPage; currentPage++) {
      const products = await this.scrapeProducts(
        page,
        halfPriceUrl,
        currentPage
      );
      if (products.length > 0) {
        await productService.saveProducts(products);
      }
    }
  }

  async getLastPageNumber(page) {
    const paginationSelector = '.paging-pageNumber';
    await page.waitForSelector(paginationSelector);

    const lastPageNumber = await page.evaluate((selector) => {
      const elements = document.querySelectorAll(selector);
      return elements.length
        ? elements[elements.length - 1].textContent.replace('Page', '').trim()
        : '1';
    }, paginationSelector);

    return parseInt(lastPageNumber, 10);
  }

  async scrapeProducts(page, halfPriceUrl, pageNumber) {
    await page.goto(`${halfPriceUrl}?pageNumber=${pageNumber}`);
    logger.debug(`Scraping page ${pageNumber}`);

    const selector = config.woolies.selectors.productTile;
    const productsLocator = page.locator(selector);
    await productsLocator.first().waitFor({ state: 'visible' });

    const productsHandle = await productsLocator.elementHandles();

    const products = (
      await Promise.all(
        productsHandle.map(async (element) => {
          const ariaLabel = await element.getAttribute('aria-label');
          const link = await element.getAttribute('href');
          const image = await element.$eval('img', (img) =>
            img.getAttribute('src')
          );
          return this.extractProducts(ariaLabel, link, image);
        })
      )
    ).filter(Boolean);

    return products;
  }

  extractProducts(ariaLabel, link, image) {
    if (!ariaLabel || !ariaLabel.includes('Half Price')) {
      return null;
    }

    const parts = ariaLabel.split('. ');
    const { name, price, pricePerUnit } = this.extractProductInfo(
      parts[parts.length - 1] || ''
    );

    const savings = parts[2]
      ? Number(parseFloat(parts[2].replace(/Save \$/, '').trim())) || null
      : null;

    const originalPrice =
      price !== null && savings !== null ? price + savings : null;

    return {
      name: name,
      price: price !== null ? Number(price.toFixed(2)) : null,
      savings: savings,
      originalPrice: Number(originalPrice.toFixed(2)) ?? null,
      pricePerUnit: pricePerUnit ?? null,
      link: link ? `${config.woolies.baseURL}${link}` : null,
      image: image ?? null,
      brand: 'Woolies',
    };
  }

  extractProductInfo(parts) {
    const [name, price, pricePerUnit] = parts
      .split(/, (?=\$)/)
      .map((part) => part.trim());

    return {
      name,
      price: this.parsePrice(price),
      pricePerUnit: pricePerUnit ? pricePerUnit.slice(0, -1) : null,
    };
  }

  parsePrice(priceString) {
    const price = parseFloat(priceString?.replace('$', ''));
    return isNaN(price) ? null : Number(price.toFixed(2));
  }
}

module.exports = new WooliesStrategy();
