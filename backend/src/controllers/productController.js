const productService = require("../services/productService");
const { BadRequestError } = require("../utils/errors");

const validateProductPayload = (payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new BadRequestError("Empty payload: product data is required");
  }

  const allowedFields = [
    "name",
    "price",
    "pricePerUnit",
    "link",
    "image",
    "brand",
  ];
  const payloadKeys = Object.keys(payload);

  const invalidFields = payloadKeys.filter(
    (key) => !allowedFields.includes(key)
  );
  if (invalidFields.length > 0) {
    throw new BadRequestError(`Invalid field(s): ${invalidFields.join(", ")}`);
  }

  return payload;
};

const productController = {
  async getProducts(req, res) {
    const { brand } = req.query;
    const products = await productService.getProducts(brand);

    const totalProducts = products.length;
    const productsByBrand = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalProducts,
      productsByBrand,
      products,
    });
  },

  async getProductById(req, res) {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  },

  async getPriceHistory(req, res) {
    const priceHistory = await productService.getPriceHistory(req.params.id);
    res.json(priceHistory);
  },

  async saveProducts(req, res) {
    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new BadRequestError("Invalid products data");
    }

    const savedProducts = await productService.saveProducts(products);
    res
      .status(201)
      .json({ message: "Products successfully saved", savedProducts });
  },

  async createProduct(req, res) {
    const validatedPayload = validateProductPayload(req.body);
    const product = await productService.createProduct(validatedPayload);
    res.status(201).json({ message: "Product successfully created", product });
  },

  async updateProduct(req, res) {
    const validatedPayload = validateProductPayload(req.body);
    const product = await productService.updateProduct(
      req.params.id,
      validatedPayload
    );
    res.json({ message: "Product successfully updated", product });
  },

  async deleteProduct(req, res) {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  },

  async deleteProduct(req, res) {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  },
};

module.exports = productController;
