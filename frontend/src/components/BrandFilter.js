import React from 'react';
import { useBrand } from '../context/BrandContext';
import '../styles/components/BrandFilter.css';

function BrandFilter() {
  const { activeBrand, setActiveBrand } = useBrand();

  return (
    <div className="brand-filter">
      <button
        className={`brand-button ${activeBrand === '' ? 'active' : ''}`}
        onClick={() => setActiveBrand('')}
      >
        All Brands
      </button>
      <button
        className={`brand-button ${activeBrand === 'Coles' ? 'active' : ''}`}
        onClick={() => setActiveBrand('Coles')}
      >
        Coles
      </button>
      <button
        className={`brand-button ${activeBrand === 'Woolies' ? 'active' : ''}`}
        onClick={() => setActiveBrand('Woolies')}
      >
        Woolworths
      </button>
    </div>
  );
}

export default BrandFilter;
