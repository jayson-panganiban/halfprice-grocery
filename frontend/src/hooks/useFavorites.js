import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

function useFavorites() {
  const { favorites, allTimeFavorites, toggleFavorite, isFavorite } =
    useContext(FavoritesContext);

  return {
    favorites,
    allTimeFavorites,
    toggleFavorite,
    isFavorite,
  };
}

export default useFavorites;
