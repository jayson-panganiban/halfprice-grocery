import React, { useCallback, useMemo } from 'react';
import '../styles/components/BrandTabs.css';

const brands = [
  { name: 'Coles', key: 'coles' },
  { name: 'Woolies', key: 'woolies' },
];

const BrandTab = React.memo(({ brand, isActive, onClick }) => (
  <button
    className={`brand-tab ${isActive ? 'active' : ''}`}
    onClick={onClick}
    data-brand={brand.key}
    aria-pressed={isActive}
  >
    {brand.name}
  </button>
));

function BrandTabs({ selectedBrand, onBrandChange }) {
  const handleBrandClick = useCallback(
    (brand) => () => onBrandChange(brand),
    [onBrandChange]
  );

  const tabs = useMemo(
    () =>
      brands.map((brand) => (
        <BrandTab
          key={brand.key}
          brand={brand}
          isActive={selectedBrand === brand.key}
          onClick={handleBrandClick(brand.key)}
        />
      )),
    [selectedBrand, handleBrandClick]
  );

  return (
    <div className="brand-tabs" role="tablist" aria-label="Supermarket brands">
      {tabs}
    </div>
  );
}

export default React.memo(BrandTabs);
