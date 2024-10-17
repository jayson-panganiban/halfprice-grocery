import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import ProductCard from './ProductCard';

function Favorites() {
  const { favorites, allTimeFavorites } = useContext(FavoritesContext);

  return (
    <div className="favorite-products">
      <h2>Current Week Favorites</h2>
      <div className="product-grid">
        {favorites.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <h2>All-Time Favorites</h2>
      <div className="product-grid">
        {allTimeFavorites.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
