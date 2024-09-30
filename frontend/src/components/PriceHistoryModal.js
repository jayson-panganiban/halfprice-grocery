import React, { useState, useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import PriceHistoryChart from './PriceHistoryChart';
import '../styles/components/PriceHistoryModal.css';

function PriceHistoryModal({ product, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for the animation to finish before closing
  };

  return (
    <div className={`price-history-modal ${isVisible ? 'visible' : ''}`}>
      <div className="price-history-content">
        <button className="price-history-close-button" onClick={handleClose}>
          <X size={24} weight="bold" />
        </button>
        <h2 className="price-history-title">
          {product.name}
          <br />
          <span className="price-history-subtitle">
            Discounted Price History
          </span>
        </h2>
        <PriceHistoryChart
          priceHistory={product.priceHistory}
          productName={product.name}
        />
      </div>
    </div>
  );
}

export default PriceHistoryModal;
