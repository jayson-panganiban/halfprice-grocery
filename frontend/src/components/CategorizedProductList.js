import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import useFilteredProducts from '../hooks/useFilteredProducts';
import ProductCard from './ProductCard';
import NoResults from './NoResults';
import { categorizeProducts } from '../utils/categoryUtils';

function CategorizedProductList({
  selectedBrand,
  selectedCategory,
  searchTerm,
  cachedProducts,
}) {
  const categorizedProducts = useMemo(
    () => categorizeProducts(cachedProducts || []),
    [cachedProducts]
  );

  const products = categorizedProducts[selectedCategory] || [];
  const filteredProducts = useFilteredProducts(products, searchTerm);

  return (
    <>
      <Helmet>
        <title>{`${selectedCategory} Deals - ${selectedBrand} | HalfPrice Grocery`}</title>
        <meta
          name="description"
          content={`Browse half-price ${selectedCategory} deals from ${selectedBrand}.`}
        />
      </Helmet>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <NoResults />
      )}
    </>
  );
}

export default React.memo(CategorizedProductList);
