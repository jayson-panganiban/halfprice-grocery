const express = require("express");
const router = express.Router();
const scraperService = require("../services/scraperService");
const logger = require("../logger");

router.post("/run", async (req, res) => {
  try {
    await scraperService.runScraper();
    res.json({ message: "Scraper run successfully" });
  } catch (error) {
    logger.error("Error running scraper:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
