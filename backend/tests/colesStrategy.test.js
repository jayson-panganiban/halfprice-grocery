const colesStrategy = require('../src/strategies/colesStrategy');
const config = require('../src/config/scraper');

describe('Coles Strategy', () => {
  describe('mapProductData', () => {
    const baseURL = config.coles.baseURL;

    it('should correctly parse product information', () => {
      // TODO: Use JSDOM for web element
      const mockElements = [
        {
          querySelector: (selector) => ({
            getAttribute: (attr) => {
              if (
                selector === '.product__image_area a' &&
                attr === 'aria-label'
              ) {
                return 'Pancit Canton Calamansi &amp; Lime | 250g';
              }
              if (selector === 'img' && attr === 'src') {
                return 'test-image.jpg';
              }
              if (selector === 'a' && attr === 'href') {
                return '/test-product';
              }
              return null;
            },
            textContent: {
              ".price__value[data-testid='product-pricing']": '$8.50',
              '.price__was': ' | Was $17.00',
              '.badge-label': 'Save $8.50',
              '.price__calculation_method': '$1.13 per 100g',
            }[selector],
          }),
        },
      ];

      const result = colesStrategy.mapProductData(mockElements, baseURL);

      expect(result).toEqual([
        {
          name: 'Pancit Canton Calamansi & Lime | 250g',
          price: 8.5,
          savings: 8.5,
          originalPrice: 17.0,
          pricePerUnit: '$1.13 per 100g',
          image: 'test-image.jpg',
          link: `${baseURL}/test-product`,
          brand: 'Coles',
        },
      ]);
    });

    it('should handle missing price correctly', () => {
      const mockElements = [
        {
          querySelector: (selector) => ({
            textContent: {
              'h2.product__title': 'Test Product',
            }[selector],
            getAttribute: () => null,
          }),
        },
      ];

      const result = colesStrategy.mapProductData(mockElements, baseURL);

      expect(result[0].price).toBeNull();
      expect(result[0].originalPrice).toBeNull();
    });

    it('should handle missing savings correctly', () => {
      const mockElements = [
        {
          querySelector: (selector) => ({
            textContent: {
              'h2.product__title': 'No Savings Product',
              ".price__value[data-testid='product-pricing']": '$10.00',
            }[selector],
            getAttribute: () => null,
          }),
        },
      ];

      const result = colesStrategy.mapProductData(mockElements, baseURL);

      expect(result[0].savings).toBeNull();
    });

    it('should handle missing originalPrice correctly', () => {
      const mockElements = [
        {
          querySelector: (selector) => ({
            textContent: {
              'h2.product__title': 'No Original Price Product',
              ".price__value[data-testid='product-pricing']": '$10.00',
            }[selector],
            getAttribute: () => null,
          }),
        },
      ];

      const result = colesStrategy.mapProductData(mockElements, baseURL);

      expect(result[0].originalPrice).toBeNull();
    });

    it('should handle missing pricePerUnit correctly', () => {
      const mockElements = [
        {
          querySelector: (selector) => ({
            textContent: {
              'h2.product__title': 'No Price Per Unit Product',
              ".price__value[data-testid='product-pricing']": '$10.00',
            }[selector],
            getAttribute: () => null,
          }),
        },
      ];

      const result = colesStrategy.mapProductData(mockElements, baseURL);

      expect(result[0].pricePerUnit).toBeNull();
    });

    it('should handle missing image correctly', () => {
      const mockElements = [
        {
          querySelector: (selector) => ({
            textContent: {
              'h2.product__title': 'No Image Product',
              ".price__value[data-testid='product-pricing']": '$10.00',
            }[selector],
            getAttribute: () => null,
          }),
        },
      ];

      const result = colesStrategy.mapProductData(mockElements, baseURL);

      expect(result[0].image).toBeNull();
    });

    it('should handle missing link correctly', () => {
      const mockElements = [
        {
          querySelector: (selector) => ({
            textContent: {
              'h2.product__title': 'No Link Product',
              ".price__value[data-testid='product-pricing']": '$10.00',
            }[selector],
            getAttribute: () => null,
          }),
        },
      ];

      const result = colesStrategy.mapProductData(mockElements, baseURL);

      expect(result[0].link).toBeNull();
    });
  });
});
