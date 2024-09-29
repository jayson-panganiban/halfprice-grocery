const express = require('express');
const productRoutes = require('./productRoutes');
const scraperRoutes = require('./scraperRoutes');

const router = express.Router();

router.use('/products', productRoutes);
router.use('/scraper', scraperRoutes);

module.exports = router;
