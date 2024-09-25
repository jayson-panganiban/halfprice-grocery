import React from 'react';
import '../styles/components/ProductCardSkeleton.css';

const ProductCardSkeleton = ({ brand }) => {
  return (
    <div className={`product-card-skeleton ${brand.toLowerCase()}`}>
      <div className="skeleton-image-container">
        <div className="skeleton-image"></div>
        <div className="skeleton-savings-badge"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-price-container">
          <div className="skeleton-current-price"></div>
          <div className="skeleton-original-price"></div>
        </div>
        <div className="skeleton-savings"></div>
        <div className="skeleton-price-per-unit"></div>
        <div className="skeleton-brand-logo"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
