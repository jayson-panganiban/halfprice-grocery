import { useMemo } from 'react';

function useFilteredProducts(products, searchTerm) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return filteredProducts;
}

export default useFilteredProducts;
