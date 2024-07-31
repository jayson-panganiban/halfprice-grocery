const mongoose = require("mongoose");
const Joi = require("joi");

const productValidationSchema = Joi.object({
  name: Joi.string().required().trim().max(255),
  price: Joi.string().allow(null, "").trim(),
  pricePerUnit: Joi.string().allow(null, "").trim(),
  link: Joi.string().allow(null, "").uri(),
  image: Joi.string().allow(null, "").uri(),
  brand: Joi.string().required().trim(),
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      index: true,
    },
    price: {
      type: String,
      required: false,
      trim: true,
    },
    pricePerUnit: {
      type: String,
      required: false,
      trim: true,
    },
    link: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 1, brand: 1 }, { unique: true });

ProductSchema.methods.validateProduct = function () {
  return productValidationSchema.validate(this.toObject());
};

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
