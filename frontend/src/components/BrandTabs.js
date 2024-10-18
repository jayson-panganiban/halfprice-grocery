import React, { useCallback } from 'react';
import '../styles/components/BrandTabs.css';

const BrandTab = React.memo(({ brand, isActive, onClick }) => (
  <button
    className={`brand-tab ${isActive ? 'active' : ''}`}
    onClick={onClick}
    data-brand={brand.toLowerCase()}
  >
    {brand}
  </button>
));

function BrandTabs({ selectedBrand, onBrandChange }) {
  const handleBrandClick = useCallback(
    (brand) => () => onBrandChange(brand),
    [onBrandChange]
  );

  return (
    <div className="brand-tabs">
      <BrandTab
        brand="Coles"
        isActive={selectedBrand === 'coles'}
        onClick={handleBrandClick('coles')}
      />
      <BrandTab
        brand="Woolies"
        isActive={selectedBrand === 'woolies'}
        onClick={handleBrandClick('woolies')}
      />
    </div>
  );
}

export default React.memo(BrandTabs);
