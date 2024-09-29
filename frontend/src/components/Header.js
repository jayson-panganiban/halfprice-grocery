import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBars } from '@fortawesome/free-solid-svg-icons';
import { FaShoppingCart } from 'react-icons/fa';
import { FavoritesContext } from '../context/FavoritesContext';
import FavoritesModal from './FavoritesModal';
import '../styles/components/Header.css';

function Header() {
  const { favorites } = useContext(FavoritesContext);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <FaShoppingCart size={28} className="logo-icon" />
          <span className="logo-text">Half-Price Groceries</span>
        </Link>

        <nav className={`main-nav ${showMobileMenu ? 'show' : ''}`}>
          <Link
            to="/"
            className="nav-link"
            onClick={() => setShowMobileMenu(false)}
          >
            Home
          </Link>
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
            className="icon-button favorite-button"
            onClick={() => setShowFavorites(true)}
          >
            <FontAwesomeIcon icon={faHeart} />
            <span className="favorites-count">{favorites.length}</span>
          </button>
          <button
            className="icon-button mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>

      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
    </header>
  );
}

export default Header;
