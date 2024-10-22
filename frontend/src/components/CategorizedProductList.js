import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import useFilteredProducts from '../hooks/useFilteredProducts';
import ProductCard from './ProductCard';
import NoResults from './NoResults';
import { categorizeProducts } from '../utils/categoryUtils';
import StructuredData from './StructuredData';

const MemoizedProductCard = React.memo(ProductCard);

function CategorizedProductList({
  selectedBrand,
  selectedCategory,
  searchTerm,
  cachedProducts,
}) {
  const [visibleProducts, setVisibleProducts] = useState(20);

  const categorizedProducts = useMemo(
    () => categorizeProducts(cachedProducts || []),
    [cachedProducts]
  );

  const products = categorizedProducts[selectedCategory] || [];
  const filteredProducts = useFilteredProducts(products, searchTerm);

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

    const sentinel = document.querySelector('#category-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [loadMoreProducts]);

  const productList = useMemo(() => {
    return filteredProducts
      .slice(0, visibleProducts)
      .map((product) => (
        <MemoizedProductCard key={product._id} product={product} />
      ));
  }, [filteredProducts, visibleProducts]);

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
        <title>{`${selectedCategory} Deals - ${selectedBrand} | HalfPrice Grocery`}</title>
        <meta
          name="description"
          content={`Browse half-price ${selectedCategory} deals from ${selectedBrand}. Find amazing discounts at Half Price Grocery!`}
        />
      </Helmet>
      <StructuredData type="ItemList" data={structuredData} />
      {filteredProducts.length > 0 ? (
        <>
          {productList}
          <div
            id="category-sentinel"
            style={{ height: '1px' }}
            aria-hidden="true"
          ></div>
        </>
      ) : (
        <NoResults />
      )}
    </>
  );
}

export default React.memo(CategorizedProductList);
