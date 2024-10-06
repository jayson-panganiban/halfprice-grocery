import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <p className="copyright">&copy; 2024 HalfPrice Grocery</p>
          <nav className="footer-nav">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
        <p className="disclaimer">
          Product names, images, and trademarks are the property of their
          respective owners. Use of these does not imply any affiliation with or
          endorsement by them.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
