const WooliesStrategy = require("../src/strategies/wooliesStrategy");
const logger = require("../src/utils/logger");

describe("Woolies Strategy", () => {
  describe("createProductDetails", () => {
    test("should create product details with all information", () => {
      const ariaLabel =
        "Half Price. On special. Save $5.75. Nescafe Blend 43 Instant Coffee 150g, $5.75, $3.83 / 100G.";
      const link = "/test-product";
      const image = "test-image.jpg";

      const result = WooliesStrategy.createProductDetails(
        ariaLabel,
        link,
        image
      );

      expect(result).toEqual({
        pricePerUnit: "$3.83 / 100G",
        image: "test-image.jpg",
        link: "https://www.woolworths.com.au/test-product",
        name: "Nescafe Blend 43 Instant Coffee 150g",
        price: "$5.75",
        brand: "Woolies",
      });
    });

    test("should handle missing information", () => {
      const ariaLabel = "Product. Details. Info. Test Product, $10.99";
      const result = WooliesStrategy.createProductDetails(ariaLabel);

      expect(result).toEqual({
        name: "Test Product",
        price: "$10.99",
        pricePerUnit: null,
        link: null,
        image: null,
        brand: "Woolies",
      });
    });

    test("should handle empty aria label", () => {
      const result = WooliesStrategy.createProductDetails("");

      expect(result).toEqual({
        name: null,
        price: null,
        pricePerUnit: null,
        link: null,
        image: null,
        brand: "Woolies",
      });
    });
  });

  describe("extractProductInfo", () => {
    test("should extract product info correctly", () => {
      const parts = ["", "", "", "Test Product, $10.99, $1.10/kg."];
      const result = WooliesStrategy.extractProductInfo(parts);

      expect(result).toEqual({
        name: "Test Product",
        price: "$10.99",
        pricePerUnit: "$1.10/kg",
      });
    });

    test("should handle missing price per unit", () => {
      const parts = ["", "", "", "Test Product, $10.99"];
      const result = WooliesStrategy.extractProductInfo(parts);

      expect(result).toEqual({
        name: "Test Product",
        price: "$10.99",
        pricePerUnit: null,
      });
    });

    test("should handle empty parts", () => {
      const parts = [];
      const result = WooliesStrategy.extractProductInfo(parts);

      expect(result).toEqual({
        name: null,
        price: null,
        pricePerUnit: null,
      });
    });
  });
});
