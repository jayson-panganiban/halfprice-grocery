import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { FavoritesContext } from '../context/FavoritesContext';
import { Trash } from 'phosphor-react';
import ProductCard from './ProductCard';
import PriceHistoryModal from './PriceHistoryModal';
import CloseButton from './CloseButton';
import '../styles/components/FavoritesModal.css';

Modal.setAppElement('#root');

function FavoritesModal({ isOpen, onClose }) {
  const { favorites, removeAllFavorites } = useContext(FavoritesContext);
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        <CloseButton onClick={onClose} />
      </div>
      <div className="favorites-actions">
        <button className="clear-favorites" onClick={removeAllFavorites}>
          <Trash size={24} />
        </button>
      </div>
      <div className="favorites-content">
        {favorites.length === 0 ? (
          <p className="no-favorites">You haven't added any favorites yet.</p>
        ) : (
          <div className="favorites-grid">
            {favorites.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPriceHistoryClick={() => handlePriceHistoryClick(product)}
              />
            ))}
          </div>
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
