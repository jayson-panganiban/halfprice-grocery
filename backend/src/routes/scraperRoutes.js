const express = require("express");
const scraperController = require("../controllers/scraperController");
const { asyncHandler } = require("../middleware");

const router = express.Router();

router.post("/:brand", asyncHandler(scraperController.runScraper));

module.exports = router;
