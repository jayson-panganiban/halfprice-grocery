export const filterProducts = (products, searchTerm) => {
  return products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
