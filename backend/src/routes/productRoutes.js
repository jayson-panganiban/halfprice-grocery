const express = require('express');
const productController = require('../controllers/productController');
const { asyncHandler } = require('../middleware');

const router = express.Router();

router.get('/', asyncHandler(productController.getProducts));
router.get('/weekly', asyncHandler(productController.getWeeklyProducts));
router.get(
  '/categorized',
  asyncHandler(productController.getCategorizedProducts)
);
router.get('/by-name', asyncHandler(productController.getProductByName));
router.get('/:id', asyncHandler(productController.getProductById));
router.get('/:id/price-history', productController.getPriceHistory);
router.post('/', asyncHandler(productController.createProduct));
router.post('/bulk', asyncHandler(productController.saveProducts));
router.put('/:id', asyncHandler(productController.updateProduct));
router.delete('/:id', asyncHandler(productController.deleteProduct));

module.exports = router;
