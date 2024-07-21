const { scrapeAll } = require("../scraper/scraper");
const logger = require("../logger");

const scraperService = {
  async runScraper() {
    try {
      logger.info("Starting scraper");
      const startTime = Date.now();
      await scrapeAll();
      const endTime = Date.now();
      logger.info(`Scraper finished successfully in ${(endTime - startTime) / 1000} seconds`);
    } catch (error) {
      logger.error("Error running scraper:", error);
      throw error;
    }
  }
};

module.exports = scraperService;
