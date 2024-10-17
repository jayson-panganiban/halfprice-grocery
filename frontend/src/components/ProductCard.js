import React, { useContext, useState, memo } from 'react';
import { Helmet } from 'react-helmet';
import { Heart, ChartLine } from 'phosphor-react';
import { FavoritesContext } from '../context/FavoritesContext';
import PriceHistoryModal from './PriceHistoryModal';
import wooliesLogo from '../assets/woolies.png';
import colesLogo from '../assets/coles.png';
import '../styles/components/ProductCard.css';

const ProductCard = memo(({ product }) => {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const [showPriceHistory, setShowPriceHistory] = useState(false);

  const getBrandLogo = (brand) => {
    switch (brand.toLowerCase()) {
      case 'woolies':
        return wooliesLogo;
      case 'coles':
        return colesLogo;
      default:
        return null;
    }
  };

  const calculateSavings = () => {
    const originalPrice = product.originalPrice;
    const savings = product.savings;
    const savingsPercentage = (savings / originalPrice) * 100;
    return {
      amount: savings.toFixed(2),
      percentage: savingsPercentage.toFixed(0),
    };
  };

  const savings = calculateSavings();

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={`${product.name} on sale at ${product.brand}. Save ${savings.percentage}% now!`}
        />
      </Helmet>
      <div className="product-card">
        <div className="product-image-container">
          <div className="savings-badge">
            <span>-{savings.percentage}%</span>
          </div>
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
            <img
              src={getBrandLogo(product.brand)}
              alt={product.brand}
              className="brand-logo"
              loading="lazy"
            />
          </a>
        </div>
        <div className="product-info-container">
          <div className="product-name">{product.name}</div>
          <div className="price-container">
            <p className="current-price">${product.price.toFixed(2)}</p>
            <p className="original-price">
              ${product.originalPrice.toFixed(2)}
            </p>
          </div>
          <div className="price-and-actions-container">
            {product.pricePerUnit && (
              <p className="price-per-unit">{product.pricePerUnit}</p>
            )}
            <div className="product-actions">
              <button
                className="price-history-button"
                onClick={() => setShowPriceHistory(true)}
              >
                <ChartLine size={24} />
              </button>
              <button
                className="favorite-button"
                onClick={() => toggleFavorite(product)}
              >
                <Heart
                  size={24}
                  weight={isFavorite(product._id) ? 'fill' : 'regular'}
                  className={
                    isFavorite(product._id) ? 'heart-icon filled' : 'heart-icon'
                  }
                />
              </button>
            </div>
          </div>
          {showPriceHistory && (
            <PriceHistoryModal
              product={product}
              onClose={() => setShowPriceHistory(false)}
            />
          )}
        </div>
      </div>
    </>
  );
});

export default ProductCard;
