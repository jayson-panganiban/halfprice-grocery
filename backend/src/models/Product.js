const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: String,
  salePrice: String,
  amountSaved: String,
  pricePerUnit: String,
  productLink: String,
  productImage: String,
  scrapedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
