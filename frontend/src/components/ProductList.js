import React, { useState, useEffect } from "react";
import { getProducts } from "../utils/api";
import ProductCard from "./ProductCard";
import SearchBar from "./Searchbar";
import BrandFilter from "./BrandFilter";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [selectedBrand]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(selectedBrand);
      setProducts(data.products);
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
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-list">
      <SearchBar onSearch={handleSearch} />
      <BrandFilter onBrandChange={handleBrandChange} />
      {filteredProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
