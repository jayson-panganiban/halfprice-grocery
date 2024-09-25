import React from 'react';
import '../styles/components/ProductListLayout.css';

function ProductListLayout({ filters, content, error }) {
  return (
    <div className="product-list-container">
      <div className="filters-container">{filters}</div>
      <div className="products-grid">{content}</div>
      {error}
    </div>
  );
}

export default ProductListLayout;
