import React from 'react';
import { X } from '@phosphor-icons/react';
import PriceHistoryChart from './PriceHistoryChart';
import '../styles/components/PriceHistoryModal.css';

function PriceHistoryModal({ product, onClose }) {
  return (
    <div className="price-history-modal">
      <div className="price-history-content">
        <button className="close-button" onClick={onClose}>
          <X size={24} weight="bold" />
        </button>
        <h2 className="price-history-title">
          {product.name} - Discounted Price History
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
