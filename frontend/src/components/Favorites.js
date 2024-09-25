import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import ProductCard from './ProductCard';

function Favorites() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="favorite-products">
      <h2>Favorite Products</h2>
      <div className="product-grid">
        {favorites.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
