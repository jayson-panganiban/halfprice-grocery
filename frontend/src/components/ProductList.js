import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { getWeeklyProducts } from '../utils/api';
import useFilteredProducts from '../hooks/useFilteredProducts';
import ProductCard from './ProductCard';
import LoadingSkeleton from './LoadingSkeleton';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import CategorizedProductList from './CategorizedProductList';
import BackToTopButton from './BackToTopButton';
import NoResults from './NoResults';
import ErrorMessage from './ErrorMessage';
import BrandTabs from './BrandTabs';
import ProductListLayout from './ProductListLayout';
import StructuredData from './StructuredData';

function ProductList() {
  const [products, setProducts] = useState({ coles: [], woolies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('coles');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
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
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory === 'All') {
      fetchProducts();
    }
  }, [selectedBrand, selectedCategory]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSelectedCategory('All');
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
        <LoadingSkeleton count={10} brand={selectedBrand} />
      ) : filteredProducts.length > 0 ? (
        <>
          <StructuredData products={filteredProducts} />
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </>
      ) : (
        <NoResults />
      )}
    </>
  );

  const structuredData = {
    itemListElement: filteredProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: `${product.name} available at Half Price Grocery`,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'AUD',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>
          Half Price Grocery Specials - Save on Your Weekly Groceries
        </title>
        <meta
          name="description"
          content={`Browse this week's half-price grocery specials from ${selectedBrand}. Find amazing discounts at Half Price Grocery!`}
        />
      </Helmet>
      <StructuredData type="ItemList" data={structuredData} />
      <ProductListLayout
        filters={filters}
        content={
          selectedCategory === 'All' ? (
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
