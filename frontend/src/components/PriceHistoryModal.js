import React, { useState, useEffect } from 'react';
import PriceHistoryChart from './PriceHistoryChart';
import CloseButton from './CloseButton';
import '../styles/components/PriceHistoryModal.css';

function PriceHistoryModal({ product, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`price-history-modal ${isVisible ? 'visible' : ''}`}>
      <div className="price-history-content">
        <CloseButton onClick={handleClose} />
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
