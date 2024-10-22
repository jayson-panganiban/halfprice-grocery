import React from 'react';

function FavoritesTabs({ activeTab, setActiveTab }) {
  return (
    <h2 className="favorites-tabs">
      <button
        className={`favorites-tab ${activeTab === 'thisWeek' ? 'active' : ''}`}
        onClick={() => setActiveTab('thisWeek')}
        aria-label="View this week's favorites"
      >
        This Week's Favorites
      </button>
      <button
        className={`favorites-tab ${activeTab === 'allTime' ? 'active' : ''}`}
        onClick={() => setActiveTab('allTime')}
        aria-label="View all-time favorites"
      >
        All-Time Favorites
      </button>
    </h2>
  );
}

export default FavoritesTabs;
