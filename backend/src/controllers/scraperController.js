const scraperService = require('../services/scraperService');

const scraperController = {
  async runScraper(req, res) {
    const { brand } = req.params;

    const scrapedProducts = await scraperService.runScraper(brand);
    res.json({
      message: `${brand} scraper completed successfully`,
      result: scrapedProducts,
    });
  },
};

module.exports = scraperController;
