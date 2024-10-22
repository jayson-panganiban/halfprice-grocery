import React from 'react';
import ProductCard from './ProductCard';

const MemoizedProductCard = React.memo(ProductCard);

function ProductGrid({ products }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <MemoizedProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default React.memo(ProductGrid);
