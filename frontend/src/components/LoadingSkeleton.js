import React, { useMemo } from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

function LoadingSkeleton({ count = 8 }) {
  const skeletons = useMemo(() => {
    return Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ));
  }, [count]);

  return <>{skeletons}</>;
}

export default React.memo(LoadingSkeleton);
