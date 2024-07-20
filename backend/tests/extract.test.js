const { createProductDetails } = require("../src/scraper/scraper.js");

describe("Test Extract Product Details", () => {
  test("Broken arialabel", async () => {
    const ariaLabel =
      "Everyday Market free shipping. On special. Save $1,200.00. VoltX M2000 Power Station, $799, .";

    const itemLink = "/Power";
    const img = "img1.jpg";

    const productDetails = await createProductDetails(ariaLabel, itemLink, img);

    const expectedProductDetails = {
      amountSaved: "$1,200.00",
      pricePerUnit: null,
      productImage: "img1.jpg",
      productLink: "/Power",
      productName: "VoltX M2000 Power Station",
      salePrice: "$799",
    };

    expect(productDetails).toEqual(expectedProductDetails);
  });

  test("Complete arialabel", async () => {
    const ariaLabel =
      "Half Price. On special. Save $8.40. Pancit Canton 500g, $8.4, $11.20 / 1KG.";

    const itemLink = "/itemLink";
    const img = "img1.jpg";

    const productDetails = await createProductDetails(ariaLabel, itemLink, img);

    const expectedProductDetails = {
      amountSaved: "$8.40",
      pricePerUnit: "$11.20 / 1KG",
      productImage: "img1.jpg",
      productLink: "/itemLink",
      productName: "Pancit Canton 500g",
      salePrice: "$8.4",
    };

    expect(productDetails).toEqual(expectedProductDetails);
  });
});
