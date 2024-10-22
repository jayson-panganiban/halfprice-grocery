import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import ProductGrid from './ProductGrid';
import StructuredData from './StructuredData';
import useFavorites from '../hooks/useFavorites';

function Favorites() {
  const { favorites, allTimeFavorites } = useFavorites();

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: [...favorites, ...allTimeFavorites].map(
        (product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            description: `${product.name} - Favorite product at Half Price Grocery`,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'AUD',
              availability: 'https://schema.org/InStock',
            },
          },
        })
      ),
    }),
    [favorites, allTimeFavorites]
  );

  return (
    <>
      <Helmet>
        <title>Your Favorite Products - Half Price Grocery</title>
        <meta
          name="description"
          content="View your favorite products from Half Price Grocery. See your current week's favorites and all-time favorite items."
        />
      </Helmet>
      <StructuredData type="ItemList" data={structuredData} />
      <div className="favorite-products">
        <h2>Current Week Favorites</h2>
        <ProductGrid products={favorites} />

        <h2>All-Time Favorites</h2>
        <ProductGrid products={allTimeFavorites} />
      </div>
    </>
  );
}

export default React.memo(Favorites);
