import moment from 'moment-timezone';
import React, { useContext, useState, useMemo } from 'react';
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
  const [activeTab, setActiveTab] = useState('thisWeek');

  const handlePriceHistoryClick = (product) => {
    setSelectedProduct(product);
    setShowPriceHistory(true);
  };

  const isCurrentWeek = (product) => {
    const now = moment().tz('Australia/Sydney');
    const currentDay = now.day();
    const currentHour = now.hour();

    let startDate = now
      .clone()
      .startOf('week')
      .add(3, 'days')
      .hour(7)
      .minute(0)
      .second(0);

    if (currentDay < 3 || (currentDay === 3 && currentHour < 7)) {
      startDate.subtract(7, 'days');
    }

    const endDate = startDate.clone().add(7, 'days').subtract(1, 'minute');

    const productDate = moment(product.date).tz('Australia/Sydney');
    return productDate.isBetween(startDate, endDate, null, '[]');
  };

  const { thisWeekFavorites, allTimeFavorites } = useMemo(() => {
    const thisWeek = favorites.filter(isCurrentWeek);
    const allTime = favorites.filter((product) => !isCurrentWeek(product));
    return { thisWeekFavorites: thisWeek, allTimeFavorites: allTime };
  }, [favorites]);

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
      <div className="favorites-tabs">
        <button
          className={`favorites-tab ${
            activeTab === 'thisWeek' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('thisWeek')}
        >
          This Week's Favorites
        </button>
        <button
          className={`favorites-tab ${activeTab === 'allTime' ? 'active' : ''}`}
          onClick={() => setActiveTab('allTime')}
        >
          All-Time Favorites
        </button>
        <button className="clear-favorites" onClick={removeAllFavorites}>
          <Trash size={24} />
        </button>
      </div>

      <div className="favorites-content">
        {activeTab === 'thisWeek' && thisWeekFavorites.length === 0 && (
          <p className="no-favorites">
            You haven't added any favorites for this week yet.
          </p>
        )}
        {activeTab === 'allTime' && allTimeFavorites.length === 0 && (
          <p className="no-favorites">
            You haven't added any all-time favorites yet.
          </p>
        )}
        {((activeTab === 'thisWeek' && thisWeekFavorites.length > 0) ||
          (activeTab === 'allTime' && allTimeFavorites.length > 0)) && (
          <div className="favorites-grid">
            {(activeTab === 'thisWeek'
              ? thisWeekFavorites
              : allTimeFavorites
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

      {/* ... (rest of the JSX remains the same) */}
    </Modal>
  );
}

export default FavoritesModal;
