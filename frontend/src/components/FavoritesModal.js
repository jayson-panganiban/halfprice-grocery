import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { FavoritesContext } from '../context/FavoritesContext';
import ProductCard from './ProductCard';
import CloseButton from './CloseButton';
import '../styles/components/FavoritesModal.css';

Modal.setAppElement('#root');

function FavoritesModal({ isOpen, onClose }) {
  const { favorites, allTimeFavorites } = useContext(FavoritesContext);
  const [setShowPriceHistory] = useState(false);
  const [setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('thisWeek');

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
        <h2 className="favorites-tabs">
          <button
            className={`favorites-tab ${
              activeTab === 'thisWeek' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('thisWeek')}
          >
            This Week's Favorites
          </button>
          <button
            className={`favorites-tab ${
              activeTab === 'allTime' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('allTime')}
          >
            All-Time Favorites
          </button>
          <CloseButton onClick={onClose} />
        </h2>
      </div>

      <div className="favorites-content">
        {activeTab === 'thisWeek' && favorites.length === 0 && (
          <p className="no-favorites">
            You haven't added any favorites for this week yet.
          </p>
        )}
        {activeTab === 'allTime' && allTimeFavorites.length === 0 && (
          <p className="no-favorites">
            You haven't added any all-time favorites yet.
          </p>
        )}
        {((activeTab === 'thisWeek' && favorites.length > 0) ||
          (activeTab === 'allTime' && allTimeFavorites.length > 0)) && (
          <div className="favorites-grid">
            {(activeTab === 'thisWeek' ? favorites : allTimeFavorites).map(
              (product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPriceHistoryClick={() => handlePriceHistoryClick(product)}
                />
              )
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default FavoritesModal;
