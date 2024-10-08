import React, { useState, useEffect, useCallback } from "react";
import { getCategorizedProducts } from "../utils/api";
import useFilteredProducts from "../hooks/useFilteredProducts";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";
import NoResults from "./NoResults";
import ErrorMessage from "./ErrorMessage";

function CategorizedProductList({
  selectedBrand,
  selectedCategory,
  searchTerm,
}) {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategorizedProducts = useCallback(async () => {
    if (products[selectedBrand]?.[selectedCategory]) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getCategorizedProducts(
        selectedBrand,
        selectedCategory
      );
      setProducts((prevProducts) => ({
        ...prevProducts,
        [selectedBrand]: {
          ...prevProducts[selectedBrand],
          [selectedCategory]: data[selectedCategory] || [],
        },
      }));
    } catch (error) {
      setError("Failed to fetch categorized products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedBrand, selectedCategory, products]);

  useEffect(() => {
    fetchCategorizedProducts();
  }, [fetchCategorizedProducts]);

  const filteredProducts = useFilteredProducts(
    products[selectedBrand]?.[selectedCategory] || [],
    searchTerm
  );

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
