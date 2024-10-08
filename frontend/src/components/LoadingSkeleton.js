import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

function LoadingSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </>
  );
}

export default LoadingSkeleton;
