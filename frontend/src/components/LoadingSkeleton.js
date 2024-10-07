import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

function LoadingSkeleton({ count = 8, isMobile }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} isMobile={isMobile} />
      ))}
    </>
  );
}

export default LoadingSkeleton;
