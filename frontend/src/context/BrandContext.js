import React, { createContext, useState, useContext, useMemo } from 'react';

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [activeBrand, setActiveBrand] = useState('');

  const value = useMemo(() => ({ activeBrand, setActiveBrand }), [activeBrand]);

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
