import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Headroom from 'react-headroom';
import { Heart, ShoppingBag, List, X } from 'phosphor-react';
import { FavoritesContext } from '../context/FavoritesContext';
import FavoritesModal from './FavoritesModal';
import '../styles/components/Header.css';

function Header() {
  const { favorites } = useContext(FavoritesContext);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      <Helmet>
        <title>HalfPrice Grocery - Halfprice Specials on Groceries</title>
        <meta
          name="description"
          content="Find the best half-price specials on groceries from major Australian supermarkets at HalfPrice Grocery."
        />
      </Helmet>
      <Headroom>
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">
              <ShoppingBag size={32} weight="fill" />
              <span className="logo-text">
                <span className="logo-half">Half</span>
                <span className="logo-price">Price</span>
                <span className="logo-grocery">Grocery</span>
              </span>
            </Link>
            <nav className={`main-nav ${showMobileMenu ? 'show' : ''}`}>
              <Link
                to="/about"
                className="nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="nav-link"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
            </nav>
            <div className="user-actions">
              <button
                className="heart-icon"
                onClick={() => setShowFavorites(true)}
              >
                <Heart size={32} weight="fill" />
                {favorites.length > 0 && (
                  <span className="favorites-count">{favorites.length}</span>
                )}
              </button>
              <button
                className="mobile-menu-toggle"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                {showMobileMenu ? <X size={28} /> : <List size={28} />}
              </button>
            </div>
          </div>
        </header>
        <FavoritesModal
          isOpen={showFavorites}
          onClose={() => setShowFavorites(false)}
        />
      </Headroom>
    </>
  );
}

export default Header;
