import React from 'react';
import { FaLeaf, FaShoppingBasket, FaChartLine } from 'react-icons/fa';
import { FaCoffee } from 'react-icons/fa';
import '../styles/components/About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Half-Price Groceries</h1>
      <p className="mission-statement">
        Helping fellow bargain hunters find the best grocery deals, one click at
        a time!
      </p>

      <div className="feature-grid">
        <div className="feature-item">
          <FaLeaf className="feature-icon" />
          <h2>Fresh Deals Weekly</h2>
          <p>
            I update the prices every week because who doesn't love a good deal?
          </p>
        </div>
        <div className="feature-item">
          <FaShoppingBasket className="feature-icon" />
          <h2>Wide Selection</h2>
          <p>From snacks to veggies, I've got all your munchies covered.</p>
        </div>
        <div className="feature-item">
          <FaChartLine className="feature-icon" />
          <h2>Price History</h2>
          <p>
            Track the price trends of your favorite products over time to make
            informed buying decisions.
          </p>
        </div>
      </div>

      <div className="about-story">
        <h2>My Story</h2>
        <p>
          Hey there, bargain hunters! My partner and I are always on the lookout
          for a good deal. That's when Half-Price Groceries was born. It's my
          little pet project to help myself, my beautiful partner, and others
          like us find the best grocery deals out there. It's not perfect, but
          I'm having a blast working on it in my free time. Hope you find it
          useful!
        </p>
      </div>

      <div className="support-section">
        <h2>Support This Project</h2>
        <p>
          If you find Half-Price Groceries helpful, consider buying me a coffee!
          Your support helps cover server costs and keeps me motivated to
          improve the site.
        </p>
        <button
          className="coffee-button"
          onClick={() =>
            window.open('https://www.buymeacoffee.com/jsonpanganiban', '_blank')
          }
        >
          <FaCoffee />
          <span>Buy me a coffee</span>
        </button>
      </div>
    </div>
  );
};

export default About;
