import React from "react";

function BrandFilter({ onBrandChange }) {
  return (
    <div className="brand-filter">
      <select onChange={(e) => onBrandChange(e.target.value)}>
        <option value="">All Brands</option>
        <option value="Coles">Coles</option>
        <option value="Woolies">Woolworths</option>
      </select>
    </div>
  );
}

export default BrandFilter;
