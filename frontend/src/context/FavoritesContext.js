import React, { createContext, useState, useEffect, useCallback } from 'react';
import { isFromLastWeek } from '../utils/dateUtils';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites');
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    // Filter out products without favorite flag and from last week
    return parsedFavorites
      .filter((favorite) => favorite.isFavorite)
      .filter((favorite) => !isFromLastWeek(favorite.dateAdded));
  });

  const [allTimeFavorites, setAllTimeFavorites] = useState(() => {
    const storedAllTimeFavorites = localStorage.getItem('allTimeFavorites');
    const parsedAllTimeFavorites = storedAllTimeFavorites
      ? JSON.parse(storedAllTimeFavorites)
      : [];
    // Filter out products without favorite flag
    return parsedAllTimeFavorites.filter((favorite) => favorite.isFavorite);
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
        const productWithFavoriteFlag = {
          ...product,
          isFavorite: true,
          dateAdded: new Date().toISOString(),
        };
        setAllTimeFavorites((prevAllTime) => [
          ...prevAllTime,
          productWithFavoriteFlag,
        ]);
        return [...prevFavorites, productWithFavoriteFlag];
      } else {
        setAllTimeFavorites((prevAllTime) =>
          prevAllTime.filter((fav) => fav._id !== product._id)
        );
        return prevFavorites.filter((fav) => fav._id !== product._id);
      }
    });
  }, []);

  const isFavorite = useCallback(
    (productId) => {
      return (
        favorites.some((fav) => fav._id === productId) ||
        allTimeFavorites.some((fav) => fav._id === productId)
      );
    },
    [favorites, allTimeFavorites]
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
