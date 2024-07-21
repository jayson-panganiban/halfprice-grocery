const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const scraperRoutes = require("./routes/scraperRoutes");

app.use("/products", productRoutes);
app.use("/scraper", scraperRoutes);

module.exports = app;
