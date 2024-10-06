import React, { useState, useEffect } from 'react';
import { List } from 'phosphor-react';
import SearchBar from './SearchBar';
import BrandTabs from './BrandTabs';
import CategoryFilter from './CategoryFilter';
import CloseButton from './CloseButton';
import '../styles/components/ShoppingTool.css';

function ShoppingTool({
  selectedBrand,
  onBrandChange,
  onSearch,
  onCategoryChange,
}) {
  const [showTool, setShowTool] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    // const handleResize = () => {
    //   setIsMobile(window.innerWidth <= 767);
    // };

    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowTool(true);
      } else {
        setShowTool(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showTool) return null;

  const renderMobileView = () => {
    return (
      <div className="shopping-tool">
        <div className="shopping-tool-container">
          <SearchBar onSearch={onSearch} />
          <button
            className="show-categories-btn"
            onClick={() => setShowCategories(true)}
          >
            <List size={32} />
          </button>
        </div>
        {showCategories && (
          <div className={`categories-modal ${showCategories ? 'active' : ''}`}>
            <div className="categories-modal-content">
              <CloseButton onClick={() => setShowCategories(false)} />
              <div className="categories-modal-content-inner">
                <BrandTabs
                  selectedBrand={selectedBrand}
                  onBrandChange={onBrandChange}
                />
                <CategoryFilter
                  onCategoryChange={(category) => {
                    onCategoryChange(category);
                    setShowCategories(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDesktopView = () => {
    return (
      <div className="shopping-tool">
        <div className="shopping-tool-container">
          <SearchBar onSearch={onSearch} />
          <BrandTabs
            selectedBrand={selectedBrand}
            onBrandChange={onBrandChange}
          />
          <div className="categories-container">
            <button
              className="show-categories-btn"
              onClick={() => setShowCategories(true)}
            >
              <List size={32} />
            </button>
          </div>
        </div>
        {showCategories && (
          <div className={`categories-modal ${showCategories ? 'active' : ''}`}>
            <div className="categories-modal-content">
              <CloseButton onClick={() => setShowCategories(false)} />
              <CategoryFilter
                onCategoryChange={(category) => {
                  onCategoryChange(category);
                  setShowCategories(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return <>{isMobile ? renderMobileView() : renderDesktopView()}</>;
}

export default ShoppingTool;
