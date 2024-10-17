import React, { createContext, useState, useEffect } from 'react';
import moment from 'moment-timezone';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [allTimeFavorites, setAllTimeFavorites] = useState([]);

  const isCurrentWeek = (product) => {
    const now = moment().tz('Australia/Sydney');
    const currentDay = now.day();
    const currentHour = now.hour();

    let startDate = now
      .clone()
      .startOf('week')
      .add(3, 'days')
      .hour(7)
      .minute(0)
      .second(0);

    if (currentDay < 3 || (currentDay === 3 && currentHour < 7)) {
      startDate.subtract(7, 'days');
    }

    const endDate = startDate.clone().add(7, 'days').subtract(1, 'minute');

    const productDate = moment(product.date).tz('Australia/Sydney');
    return productDate.isBetween(startDate, endDate, null, '[]');
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    const now = moment().tz('Australia/Sydney');

    const currentWeekFavorites = storedFavorites.filter((product) =>
      moment(product.updatedAt)
        .tz('Australia/Sydney')
        .isAfter(now.clone().startOf('week'))
    );
    const allTimeFavorites = storedFavorites.filter(
      (product) =>
        !moment(product.updatedAt)
          .tz('Australia/Sydney')
          .isAfter(now.clone().startOf('week'))
    );

    setFavorites(currentWeekFavorites);
    setAllTimeFavorites(allTimeFavorites);

    localStorage.setItem('favorites', JSON.stringify(currentWeekFavorites));
    localStorage.setItem('allTimeFavorites', JSON.stringify(allTimeFavorites));
  }, []);

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const saveAllTimeFavorites = (newAllTimeFavorites) => {
    localStorage.setItem(
      'allTimeFavorites',
      JSON.stringify(newAllTimeFavorites)
    );
    setAllTimeFavorites(newAllTimeFavorites);
  };

  const toggleFavorite = (product) => {
    if (isCurrentWeek(product)) {
      const index = favorites.findIndex((fav) => fav._id === product._id);
      if (index === -1) {
        saveFavorites([...favorites, product]);
      } else {
        saveFavorites(favorites.filter((fav) => fav._id !== product._id));
      }
    } else {
      const index = allTimeFavorites.findIndex(
        (fav) => fav._id === product._id
      );
      if (index === -1) {
        saveAllTimeFavorites([...allTimeFavorites, product]);
      } else {
        saveAllTimeFavorites(
          allTimeFavorites.filter((fav) => fav._id !== product._id)
        );
      }
    }
  };

  const isFavorite = (productId) => {
    return (
      favorites.some((fav) => fav._id === productId) ||
      allTimeFavorites.some((fav) => fav._id === productId)
    );
  };

  const removeAllFavorites = () => {
    saveFavorites([]);
    saveAllTimeFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        allTimeFavorites,
        toggleFavorite,
        isFavorite,
        removeAllFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
