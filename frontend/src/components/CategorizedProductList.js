import React, { useState, useEffect } from 'react';
import { getCategorizedProducts } from '../utils/api';
import useFilteredProducts from '../hooks/useFilteredProducts';
import ProductCard from './ProductCard';
import LoadingSkeleton from './LoadingSkeleton';
import NoResults from './NoResults';
import ErrorMessage from './ErrorMessage';

function CategorizedProductList({
  selectedBrand,
  selectedCategory,
  searchTerm,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategorizedProducts();
  }, [selectedBrand, selectedCategory]);

  const fetchCategorizedProducts = async () => {
    setLoading(true);
    try {
      const data = await getCategorizedProducts(
        selectedBrand,
        selectedCategory
      );
      setProducts(data[selectedCategory] || []);
    } catch (error) {
      setError('Failed to fetch categorized products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useFilteredProducts(products, searchTerm);

  return (
    <>
      {loading ? (
        <LoadingSkeleton count={8} brand={selectedBrand} />
      ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <NoResults />
      )}
      {error && <ErrorMessage message={error} />}
    </>
  );
}

export default CategorizedProductList;
