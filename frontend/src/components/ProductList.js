import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from 'react';
import { Helmet } from 'react-helmet';
import { getWeeklyProducts } from '../utils/api';
import useFilteredProducts from '../hooks/useFilteredProducts';
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

const LazyProductCard = lazy(() => import('./ProductCard'));

const BrandAndSearch = React.memo(
  ({ selectedBrand, onBrandChange, onSearch }) => (
    <div className="brand-and-search">
      <BrandTabs selectedBrand={selectedBrand} onBrandChange={onBrandChange} />
      <SearchBar onSearch={onSearch} />
    </div>
  )
);

function ProductList() {
  const [products, setProducts] = useState({ coles: [], woolies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('coles');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleProducts, setVisibleProducts] = useState(20);

  const fetchProducts = useCallback(async () => {
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
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedCategory === 'All') {
      fetchProducts();
    }
  }, [selectedBrand, selectedCategory, fetchProducts]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrand(brand);
    setSelectedCategory('All');
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const loadMoreProducts = useCallback(() => {
    setVisibleProducts((prevCount) => prevCount + 20);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 1 }
    );

    const sentinel = document.querySelector('#sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [loadMoreProducts]);

  const filteredProducts = useFilteredProducts(
    products[selectedBrand],
    searchTerm
  );

  const filters = useMemo(
    () => (
      <>
        <BrandAndSearch
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandChange}
          onSearch={handleSearch}
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </>
    ),
    [
      selectedBrand,
      selectedCategory,
      handleBrandChange,
      handleCategoryChange,
      handleSearch,
    ]
  );

  const content = useMemo(
    () => (
      <>
        {loading ? (
          <LoadingSkeleton count={10} brand={selectedBrand} />
        ) : filteredProducts.length > 0 ? (
          <>
            {filteredProducts.slice(0, visibleProducts).map((product) => (
              <Suspense key={product._id} fallback={<div>Loading...</div>}>
                <LazyProductCard product={product} />
              </Suspense>
            ))}
            <div
              id="sentinel"
              style={{ height: '1px' }}
              aria-hidden="true"
            ></div>
          </>
        ) : (
          <NoResults />
        )}
      </>
    ),
    [loading, selectedBrand, filteredProducts, visibleProducts]
  );

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: filteredProducts
        .slice(0, visibleProducts)
        .map((product, index) => ({
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
    }),
    [filteredProducts, visibleProducts]
  );

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
              cachedProducts={products[selectedBrand]}
            />
          )
        }
        error={error && <ErrorMessage message={error} />}
      />
      <BackToTopButton />
    </>
  );
}

export default React.memo(ProductList);
