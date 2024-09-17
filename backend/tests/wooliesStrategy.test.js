const wooliesStrategy = require('../src/strategies/wooliesStrategy');
const config = require('../src/config/scraper');

describe('WooliesStrategy', () => {
  describe('extractProducts', () => {
    // TODO: Use JSDOM for web element
    it('should correctly extract product information for half-price items', () => {
      const ariaLabel =
        'Half Price. On special. Save $4.25. Bulla Splits Multipack Raspberry, Mango & Lemon Lime 10 Pack, $4.25, $0.57 / 100ML.';
      const link = '/shop/productdetails/123456';
      const image = 'https://brand.com/image.jpg';

      const result = wooliesStrategy.extractProducts(ariaLabel, link, image);

      expect(result).toEqual({
        name: 'Bulla Splits Multipack Raspberry, Mango & Lemon Lime 10 Pack',
        price: 4.25,
        savings: 4.25,
        originalPrice: 8.5,
        pricePerUnit: '$0.57 / 100ML',
        link: `${config.woolies.baseURL}/shop/productdetails/123456`,
        image: 'https://brand.com/image.jpg',
        brand: 'Woolies',
      });
    });

    it('should correctly extract product information for other half-price items', () => {
      const ariaLabel =
        'Half Price. On special. Save $40.00. Blackmores Omega Triple Super Strength Fish Oil Capsules 150 Pack, $40, $0.27 / 1EA.';
      const link = '/shop/productdetails/123456';
      const image = 'https://brand.com/image.jpg';

      const result = wooliesStrategy.extractProducts(ariaLabel, link, image);

      expect(result).toEqual({
        name: 'Blackmores Omega Triple Super Strength Fish Oil Capsules 150 Pack',
        price: 40.0,
        savings: 40.0,
        originalPrice: 80,
        pricePerUnit: '$0.27 / 1EA',
        link: `${config.woolies.baseURL}/shop/productdetails/123456`,
        image: 'https://brand.com/image.jpg',
        brand: 'Woolies',
      });
    });

    it('should correctly extract product information with missing pricePerUnit', () => {
      const ariaLabel =
        'Half Price. On special. Save $5.40. Decor Vent & Seal Glass Container, Oblong 600ml, $5.4, .';
      const link = '/shop/productdetails/123456';
      const image = 'https://brand.com/image.jpg';

      const result = wooliesStrategy.extractProducts(ariaLabel, link, image);

      expect(result).toEqual({
        name: 'Decor Vent & Seal Glass Container, Oblong 600ml',
        price: 5.4,
        savings: 5.4,
        originalPrice: 10.8,
        pricePerUnit: null,
        link: `${config.woolies.baseURL}/shop/productdetails/123456`,
        image: 'https://brand.com/image.jpg',
        brand: 'Woolies',
      });
    });
    it('should return null for arialabels that do not match the expected format', () => {
      const ariaLabel =
        'Mount Franklin Lightly Sparkling Water Natural Bottle 1.25l. Earn Bonus Card Pack^ . Non-member price $1.55, $1.24 / 1L.';
      const link = '/shop/productdetails/789012';
      const image = 'https://example.com/mount-franklin.jpg';

      const result = wooliesStrategy.extractProducts(ariaLabel, link, image);

      expect(result).toBeNull();
    });

    it('should return null for another arialabels that do not match the expected format', () => {
      const ariaLabel =
        'Mount Franklin Lightly Sparkling Water Pasionfruit Multipack Cans 375ml X10 Pack. Earn Bonus Card Pack^ . Non-member price $9.5, $2.53 / 1L.';
      const link = '/shop/productdetails/987654';
      const image = 'https://example.com/mount-franklin-passionfruit.jpg';

      const result = wooliesStrategy.extractProducts(ariaLabel, link, image);

      expect(result).toBeNull();
    });
  });

  describe('extractProductInfo', () => {
    it('should correctly extract name, price, and price per unit', () => {
      const parts =
        'Bulla Splits Multipack Raspberry, Mango & Lemon Lime 10 Pack, $4.25, $0.57 / 100ML.';

      const result = wooliesStrategy.extractProductInfo(parts);

      expect(result).toEqual({
        name: 'Bulla Splits Multipack Raspberry, Mango & Lemon Lime 10 Pack',
        price: 4.25,
        pricePerUnit: '$0.57 / 100ML',
      });
    });
  });
});
