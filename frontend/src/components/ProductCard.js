import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FavoritesContext } from '../context/FavoritesContext';
import PriceHistoryModal from './PriceHistoryModal';
import wooliesLogo from '../assets/woolies.png';
import colesLogo from '../assets/coles.png';
import '../styles/components/ProductCard.css';

function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const renderMobileView = () => (
    <div className="product-card mobile">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <img
          src={getBrandLogo(product.brand)}
          alt={product.brand}
          className="brand-logo"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-container">
          <p className="current-price">${product.price.toFixed(2)}</p>
          <p className="original-price">${product.originalPrice.toFixed(2)}</p>
        </div>
        {product.pricePerUnit && (
          <p className="price-per-unit">{product.pricePerUnit}</p>
        )}
      </div>
      <div className="product-actions">
        <button
          className="price-history-button"
          onClick={() => setShowPriceHistory(true)}
        >
          <FontAwesomeIcon icon={faChartLine} />
        </button>
        <button
          className="favorite-button"
          onClick={() => toggleFavorite(product)}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={
              isFavorite(product._id) ? 'heart-icon filled' : 'heart-icon'
            }
          />
        </button>
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="product-card">
      <div className="product-image-container">
        <a href={product.link} target="_blank" rel="noopener noreferrer">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </a>
        <div className="savings-badge">-{savings.percentage}%</div>
        <img
          src={getBrandLogo(product.brand)}
          alt={product.brand}
          className="brand-logo"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-container">
          <p className="current-price">${product.price.toFixed(2)}</p>
          <p className="original-price">${product.originalPrice.toFixed(2)}</p>
        </div>
        {/* <p className="savings">You save ${savings.amount}</p> */}
        {product.pricePerUnit && (
          <p className="price-per-unit">{product.pricePerUnit}</p>
        )}
        <div className="product-actions">
          <button
            className="price-history-button"
            onClick={() => setShowPriceHistory(true)}
          >
            <FontAwesomeIcon icon={faChartLine} />
          </button>
          <button
            className="favorite-button"
            onClick={() => toggleFavorite(product)}
          >
            <FontAwesomeIcon
              icon={faHeart}
              className={
                isFavorite(product._id) ? 'heart-icon filled' : 'heart-icon'
              }
            />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}
      {showPriceHistory && (
        <PriceHistoryModal
          product={product}
          onClose={() => setShowPriceHistory(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
