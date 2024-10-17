import React from 'react';
import '../styles/components/ProductCardSkeleton.css';

const ProductCardSkeleton = () => {
  return (
    <div
      className="product-card-skeleton"
      aria-label="Loading product information"
    >
      <div className="skeleton-image-container">
        <div className="skeleton-image"></div>
        <div className="skeleton-brand-logo"></div>
        <div className="skeleton-savings-badge"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-price-container">
          <div className="skeleton-current-price"></div>
          <div className="skeleton-original-price"></div>
        </div>
        <div className="skeleton-price-per-unit"></div>
      </div>
      <div className="skeleton-actions">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

export default React.memo(ProductCardSkeleton);
