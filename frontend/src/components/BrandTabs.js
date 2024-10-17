import React from 'react';
import '../styles/components/BrandTabs.css';

function BrandTabs({ selectedBrand, onBrandChange }) {
  return (
    <div className="brand-tabs">
      <button
        className={`brand-tab ${selectedBrand === 'coles' ? 'active' : ''}`}
        onClick={() => onBrandChange('coles')}
        data-brand="coles"
      >
        Coles
      </button>
      <button
        className={`brand-tab ${selectedBrand === 'woolies' ? 'active' : ''}`}
        onClick={() => onBrandChange('woolies')}
        data-brand="woolworths"
      >
        Woolies
      </button>
    </div>
  );
}

export default React.memo(BrandTabs);
