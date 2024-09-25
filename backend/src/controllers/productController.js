const productService = require('../services/productService');
const categoryService = require('../services/categoryService');
const { BadRequestError } = require('../utils/errors');
const asyncHandler = require('../middleware/asyncHandler');

const productController = {
  getProducts: asyncHandler(async (req, res) => {
    const { brand } = req.query;
    const products = await productService.getProducts(brand);

    const totalProducts = products.length;
    const productsByBrand = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {});

    res.json({ totalProducts, productsByBrand, products });
  }),

  getWeeklyProducts: asyncHandler(async (req, res) => {
    const { brand } = req.query;
    const weeklyProducts = await productService.getWeeklyProducts(brand);

    const totalProducts = weeklyProducts.length;
    const productsByBrand = weeklyProducts.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {});

    res.json({ totalProducts, productsByBrand, products: weeklyProducts });
  }),

  getCategorizedProducts: asyncHandler(async (req, res) => {
    const { brand, category, weekly = true } = req.query;
    const categorizedProducts = await categoryService.categorizeProducts(
      brand,
      category,
      weekly === 'true'
    );
    res.json(categorizedProducts);
  }),

  getProductById: asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  }),

  getProductByName: asyncHandler(async (req, res) => {
    const { name } = req.query;
    const product = await productService.getProductByName(name);
    res.json(product);
  }),

  getPriceHistory: asyncHandler(async (req, res) => {
    const priceHistory = await productService.getPriceHistory(req.params.id);
    res.json(priceHistory);
  }),

  saveProducts: asyncHandler(async (req, res) => {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      throw new BadRequestError('Invalid products data');
    }

    const savedProducts = await productService.saveProducts(products);
    res
      .status(201)
      .json({ message: 'Products successfully saved', savedProducts });
  }),

  createProduct: asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    if (product) {
      res
        .status(201)
        .json({ message: 'Product successfully created', product });
    } else {
      res
        .status(200)
        .json({ message: 'Product creation skipped due to empty name' });
    }
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    res.json({
      message: 'Product successfully updated',
      product: updatedProduct,
    });
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  }),
};

module.exports = productController;
