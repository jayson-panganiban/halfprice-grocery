const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const scraperService = require("./services/scraperService");

app.use("/products", productRoutes);

// Route to trigger scraper
app.post("/scraper", async (req, res) => {
  await scraperService.runScraper();
  res.json({ message: "Scraper run successfully" });
});

module.exports = app;
