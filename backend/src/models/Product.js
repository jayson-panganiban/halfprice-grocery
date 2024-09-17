const mongoose = require('mongoose');
const Joi = require('joi');

const productValidationSchema = Joi.object({
  name: Joi.string().required().trim(),
  brand: Joi.string().required().trim(),
  price: Joi.number().required().precision(2),
  savings: Joi.number().required().precision(2),
  originalPrice: Joi.number().required().precision(2),
  pricePerUnit: Joi.string().trim().allow(null, ''),
  link: Joi.string().required().uri(),
  image: Joi.string().required().uri(),
  priceHistory: Joi.array()
    .items(
      Joi.object({
        price: Joi.number().precision(2),
        savings: Joi.number().precision(2),
        originalPrice: Joi.number().precision(2),
        pricePerUnit: Joi.string(),
        timestamp: Joi.date(),
      })
    )
    .optional(),
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      get: (v) => parseFloat(v.toFixed(2)),
      set: (v) => parseFloat(v.toFixed(2)),
    },
    savings: {
      type: Number,
      required: true,
      get: (v) => parseFloat(v.toFixed(2)),
      set: (v) => parseFloat(v.toFixed(2)),
    },
    originalPrice: {
      type: Number,
      required: true,
      get: (v) => parseFloat(v.toFixed(2)),
      set: (v) => parseFloat(v.toFixed(2)),
    },
    pricePerUnit: {
      type: String,
      trim: true,
      default: null,
    },
    link: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    priceHistory: [
      {
        price: Number,
        savings: Number,
        originalPrice: Number,
        pricePerUnit: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

ProductSchema.index({ name: 1, brand: 1 }, { unique: true });

ProductSchema.methods.validateProduct = function () {
  return productValidationSchema.validate(this.toObject());
};

ProductSchema.statics.findByBrandAndDateRange = function (
  brand,
  startDate,
  endDate
) {
  const query = { createdAt: { $gte: startDate, $lt: endDate } };
  if (brand) {
    query.brand = new RegExp(brand, 'i');
  }
  return this.find(query);
};

module.exports = {
  Product: mongoose.model('Product', ProductSchema),
  productValidationSchema,
  ProductSchema,
};
