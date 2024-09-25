import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

function LoadingSkeleton({ count = 8, brand }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} brand={brand} />
      ))}
    </>
  );
}

export default LoadingSkeleton;
