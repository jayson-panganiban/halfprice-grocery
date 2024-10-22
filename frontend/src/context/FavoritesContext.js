import React, { createContext, useState, useEffect, useCallback } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  const [allTimeFavorites, setAllTimeFavorites] = useState(() => {
    const storedAllTimeFavorites = localStorage.getItem('allTimeFavorites');
    return storedAllTimeFavorites ? JSON.parse(storedAllTimeFavorites) : [];
  });

  const updateLocalStorage = useCallback(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('allTimeFavorites', JSON.stringify(allTimeFavorites));
  }, [favorites, allTimeFavorites]);

  useEffect(() => {
    updateLocalStorage();
  }, [updateLocalStorage]);

  const toggleFavorite = useCallback((product) => {
    setFavorites((prevFavorites) => {
      const index = prevFavorites.findIndex((fav) => fav._id === product._id);
      if (index === -1) {
        // Add to favorites and all-time favorites
        setAllTimeFavorites((prevAllTime) => [...prevAllTime, product]);
        return [...prevFavorites, product];
      } else {
        // Remove from favorites and all-time favorites
        setAllTimeFavorites((prevAllTime) =>
          prevAllTime.filter((fav) => fav._id !== product._id)
        );
        return prevFavorites.filter((fav) => fav._id !== product._id);
      }
    });
  }, []);

  const isFavorite = useCallback(
    (productId) => {
      return favorites.some((fav) => fav._id === productId);
    },
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        allTimeFavorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
