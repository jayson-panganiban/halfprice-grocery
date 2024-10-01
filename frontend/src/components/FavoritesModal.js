import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { FavoritesContext } from '../context/FavoritesContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faChartLine,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import wooliesLogo from '../assets/woolies.png';
import colesLogo from '../assets/coles.png';
import PriceHistoryModal from './PriceHistoryModal';
import '../styles/components/FavoritesModal.css';

Modal.setAppElement('#root');

function FavoritesModal({ isOpen, onClose }) {
  const { favorites, toggleFavorite, removeAllFavorites } =
    useContext(FavoritesContext);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handlePriceHistoryClick = (product) => {
    setSelectedProduct(product);
    setShowPriceHistory(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Favorites Modal"
      className="favorites-modal"
      overlayClassName="favorites-modal-overlay"
    >
      <div className="favorites-header">
        <h2>Your Favorites</h2>
        <button className="favorites-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <div className="favorites-content">
        {favorites.length === 0 ? (
          <p className="no-favorites">You haven't added any favorites yet.</p>
        ) : (
          <>
            <div className="favorites-actions">
              <button className="clear-favorites" onClick={removeAllFavorites}>
                <FontAwesomeIcon icon={faTrash} /> Clear All
              </button>
            </div>
            <div className="favorites-grid">
              {favorites.map((product) => (
                <div key={product._id} className="favorite-item">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="favorite-link"
                  >
                    <div className="favorite-image-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="favorite-image"
                      />
                      <img
                        src={getBrandLogo(product.brand)}
                        alt={product.brand}
                        className="favorite-brand-logo"
                      />
                    </div>
                    <div className="favorite-details">
                      <h3>{product.name}</h3>
                      <p className="favorite-price">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.pricePerUnit && (
                        <p className="favorite-price-per-unit">
                          {product.pricePerUnit}
                        </p>
                      )}
                    </div>
                  </a>
                  <div className="favorite-actions">
                    <button
                      className="fave-price-history-button"
                      onClick={() => handlePriceHistoryClick(product)}
                    >
                      <FontAwesomeIcon icon={faChartLine} />
                    </button>
                    <button
                      className="remove-favorite-button"
                      onClick={() => toggleFavorite(product)}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="heart-icon filled"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {showPriceHistory && selectedProduct && (
        <PriceHistoryModal
          product={selectedProduct}
          onClose={() => setShowPriceHistory(false)}
        />
      )}
    </Modal>
  );
}

export default FavoritesModal;
