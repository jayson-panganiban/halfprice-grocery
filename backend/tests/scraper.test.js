const { Scraper } = require('../src/scraper/scraper.js')

describe('Scraper', () => {
  let scraper

  beforeEach(() => {
    scraper = new Scraper("woolies")
  })

  describe('createProductDetails', () => {
    test('should create product details with all information', () => {
      const ariaLabel = 'Half Price. On special. Save $8.40. Pancit Canton 500g, $8.4, $11.20 / 1KG.'
      const link = '/test-product'
      const image = 'test.jpg'

      const result = scraper.createProductDetails(ariaLabel, link, image)

      expect(result).toEqual({
        amountSaved: "$8.40",
        pricePerUnit: "$11.20 / 1KG",
        productImage: "test.jpg",
        productLink: "/test-product",
        productName: "Pancit Canton 500g",
        salePrice: "$8.4",
      })
    })

    test('should handle missing information', () => {
      const ariaLabel = 'Everyday Market free shipping. On special. Save $1,200.00. VoltX M2000 Power Station, $799, .'
      const link = '/test-product'

      const result = scraper.createProductDetails(ariaLabel, link)

      expect(result).toEqual({
        amountSaved: "$1,200.00",
        pricePerUnit: null,
        productImage: null,
        productLink: "/test-product",
        productName: "VoltX M2000 Power Station",
        salePrice: "$799",
      })
    })
  })

  describe('extractProductInfo', () => {
    test('should extract product info correctly', () => {
      const parts = ['', '', '', 'Test Product, $10.99, $2.99/kg.']

      const result = scraper.extractProductInfo(parts)

      expect(result).toEqual({
        name: 'Test Product',
        price: '$10.99',
        pricePerUnit: '$2.99/kg',
      })
    })

    test('should handle missing parts', () => {
      const parts = ['', '', '']

      const result = scraper.extractProductInfo(parts)

      expect(result).toEqual({
        name: null,
        price: null,
        pricePerUnit: null,
      })
    })
  })

  describe('extractAmountSaved', () => {
    test('should extract amount saved', () => {
      const parts = ['Save $5.00', 'Other info']

      const result = scraper.extractAmountSaved(parts)

      expect(result).toBe('$5.00')
    })

    test('should return null when no amount saved', () => {
      const parts = ['Other info']

      const result = scraper.extractAmountSaved(parts)

      expect(result).toBeNull()
    })
  })
})
