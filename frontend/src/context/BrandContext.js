import React, { createContext, useState, useContext } from 'react';

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [activeBrand, setActiveBrand] = useState('');

  return (
    <BrandContext.Provider value={{ activeBrand, setActiveBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
