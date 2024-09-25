import React, { useState, useEffect } from "react";
import { getWeeklyProducts } from "../utils/api";
import useFilteredProducts from "../hooks/useFilteredProducts";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";
import SearchBar from "./SearchbBar";
import CategoryFilter from "./CategoryFilter";
import CategorizedProductList from "./CategorizedProductList";
import BackToTopButton from "./BackToTopButton";
import NoResults from "./NoResults";
import ErrorMessage from "./ErrorMessage";
import BrandTabs from "./BrandTabs";
import ProductListLayout from "./ProductListLayout";

function ProductList() {
  const [products, setProducts] = useState({ coles: [], woolies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("coles");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (selectedCategory === "All") {
      fetchProducts();
    }
  }, [selectedBrand, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters = { brand: selectedBrand };
      const data = await getWeeklyProducts(filters);
      setProducts((prevProducts) => ({
        ...prevProducts,
        [selectedBrand]: data.products,
      }));
    } catch (error) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSelectedCategory("All");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = useFilteredProducts(
    products[selectedBrand],
    searchTerm
  );

  const filters = (
    <>
      <div className="brand-and-search">
        <BrandTabs
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandChange}
        />
        <SearchBar onSearch={handleSearch} />
      </div>
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
    </>
  );

  const content = (
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
    </>
  );

  return (
    <>
      <ProductListLayout
        filters={filters}
        content={
          selectedCategory === "All" ? (
            content
          ) : (
            <CategorizedProductList
              selectedBrand={selectedBrand}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
            />
          )
        }
        error={error && <ErrorMessage message={error} />}
      />
      <BackToTopButton />
    </>
  );
}

export default ProductList;
