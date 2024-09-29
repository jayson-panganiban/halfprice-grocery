const { Product } = require('../models/Product');
const CATEGORIES = require('../constants/categories');
const logger = require('../utils/logger');
const productService = require('./productService');

const categoryService = {
  async categorizeProducts(brand, category, weekly = true) {
    try {
      let products;
      if (weekly) {
        products = await productService.getWeeklyProducts(brand);
      } else {
        products = await productService.getProducts(brand);
      }

      const categorizedProducts = Object.values(CATEGORIES).reduce(
        (acc, cat) => {
          acc[cat] = [];
          return acc;
        },
        {}
      );

      const categoryMap = this.buildCategoryMap();

      products.forEach((product) => {
        const productCategory = this.determineCategory(
          product.name,
          categoryMap
        );
        categorizedProducts[productCategory].push(product);
      });

      // Filter by category if provided
      if (category) {
        const filteredCategory = Object.entries(categorizedProducts).find(
          ([key]) => key.toLowerCase() === category.toLowerCase()
        );
        return filteredCategory
          ? { [filteredCategory[0]]: filteredCategory[1] }
          : {};
      }

      return categorizedProducts;
    } catch (error) {
      logger.error('Error in categorizeProducts:', error);
      throw new Error('Failed to categorize products');
    }
  },

  buildCategoryMap() {
    return new Map([
      [CATEGORIES.BAKERY, ['bread', 'cake', 'muffin', 'pastry', 'roll', 'bun']],
      [
        CATEGORIES.DAIRY_EGGS_FRIDGE,
        ['milk', 'cheese', 'yogurt', 'eggs', 'butter', 'cream'],
      ],
      [
        CATEGORIES.PANTRY,
        [
          'pasta',
          'rice',
          'cereal',
          'canned',
          'sauce',
          'oil',
          'spice',
          'corn chips',
          'chips',
          'biscuits',
          'crackers',
          'chocolate',
          'candy',
        ],
      ],
      [CATEGORIES.FREEZER, ['frozen', 'ice cream', 'pizza']],
      [
        CATEGORIES.DRINKS,
        ['water', 'juice', 'soda', 'soft drink', 'tea', 'coffee'],
      ],
      [CATEGORIES.LIQUOR, ['wine', 'beer', 'spirits', 'alcohol']],
      [
        CATEGORIES.HEALTH_BEAUTY,
        [
          'shampoo',
          'soap',
          'toothpaste',
          'cosmetics',
          'vitamin',
          'skin care',
          'hair care',
          'makeup',
          'supplement',
          'fish oil',
          'sunscreen',
        ],
      ],
      [
        CATEGORIES.HOUSEHOLD,
        ['paper', 'cleaning', 'detergent', 'laundry', 'dishwashing'],
      ],
      [CATEGORIES.BABY, ['diaper', 'formula', 'baby food']],
      [CATEGORIES.PET, ['dog', 'cat', 'pet food', 'pet care']],
    ]);
  },

  determineCategory(productName, categoryMap) {
    const lowercaseName = productName.toLowerCase();
    for (const [category, patterns] of categoryMap) {
      if (
        patterns.some((pattern) => {
          return typeof pattern === 'string'
            ? lowercaseName.includes(pattern)
            : pattern.test(lowercaseName);
        })
      ) {
        return category;
      }
    }
    return CATEGORIES.PANTRY;
  },
};

module.exports = categoryService;
