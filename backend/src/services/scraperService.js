const { scrape } = require("../scraper/scraper");
const logger = require("../logger");

const scraperService = {
  async runScraper() {
    try {
      logger.info("Starting scraper");
      await scrape();
      logger.info("Scraper finished successfully");
    } catch (error) {
      logger.error("Error running scraper:", error);
      throw error;
    }
  },
};

module.exports = scraperService;
