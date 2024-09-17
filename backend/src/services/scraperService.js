const { scrape } = require('../scraper/scraper');
const logger = require('../utils/logger');
const scraperUtils = require('../utils/scraperUtils');

const scraperService = {
  async runScraper(brand) {
    try {
      logger.info(`Starting ${brand} scraper`);
      await scraperUtils.sleep(Math.random() * 5000 + 2000);
      await scrape(brand);
      logger.info(`${brand} scraper finished successfully`);
    } catch (error) {
      logger.error(`Error running ${brand} scraper:`, error);
      throw error;
    }
  },

  async runMultipleScrapers(brands) {
    for (const brand of brands) {
      await this.runScraper(brand);
      await scraperUtils.sleep(Math.random() * 10000 + 5000);
    }
  },
};

module.exports = scraperService;
