import React, { useState } from 'react';
import Modal from 'react-modal';
import ProductCard from './ProductCard';
import CloseButton from './CloseButton';
import FavoritesTabs from './FavoritesTabs';
import useFavorites from '../hooks/useFavorites';
import '../styles/components/FavoritesModal.css';

Modal.setAppElement('#root');

function FavoritesModal({ isOpen, onClose }) {
  const { favorites, allTimeFavorites } = useFavorites();
  const [setShowPriceHistory] = useState(false);
  const [setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('thisWeek');

  const handlePriceHistoryClick = (product) => {
    setSelectedProduct(product);
    setShowPriceHistory(true);
  };

  const sortedFavorites = [...favorites].sort(
    (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
  );

  const sortedAllTimeFavorites = [...allTimeFavorites].sort(
    (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Favorites Modal"
      className="favorites-modal"
      overlayClassName="favorites-modal-overlay"
    >
      <div className="favorites-header">
        <FavoritesTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <CloseButton onClick={onClose} />
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
            {(activeTab === 'thisWeek'
              ? sortedFavorites
              : sortedAllTimeFavorites
            ).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPriceHistoryClick={() => handlePriceHistoryClick(product)}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default FavoritesModal;
