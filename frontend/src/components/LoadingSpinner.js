import React from 'react';
import '../styles/components/LoadingSpinner.css';

const LoadingSpinner = React.memo(() => (
  <div className="loading-spinner-container">
    <div className="loading-spinner" aria-label="Loading content"></div>
    <p className="loading-text">Loading...</p>
  </div>
));

export default LoadingSpinner;
