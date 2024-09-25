import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">&copy; 2024 Half-Price Groceries</p>
        <nav className="footer-nav">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
