import React from 'react';
import '../styles/components/ProductListLayout.css';

function ProductListLayout({ filters, content, error }) {
  return (
    <div className="product-list-layout">
      <div className="filter-container">{filters}</div>
      <div className="product-list-container">
        <div className="products-grid">{content}</div>
        {error}
      </div>
    </div>
  );
}

export default React.memo(ProductListLayout);
