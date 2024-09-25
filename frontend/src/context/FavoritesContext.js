import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (product) => {
    const index = favorites.findIndex((fav) => fav._id === product._id);
    if (index === -1) {
      saveFavorites([...favorites, product]);
    } else {
      saveFavorites(favorites.filter((fav) => fav._id !== product._id));
    }
  };

  const isFavorite = (productId) => {
    return favorites.some((fav) => fav._id === productId);
  };

  const removeAllFavorites = () => {
    saveFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeAllFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
