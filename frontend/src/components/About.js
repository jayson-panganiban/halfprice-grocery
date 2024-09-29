import React from 'react';
import {
  FaLeaf,
  FaShoppingBasket,
  FaChartLine,
  FaCoffee,
} from 'react-icons/fa';
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
        {[
          {
            icon: FaLeaf,
            title: 'Fresh Deals Weekly',
            description:
              "I update the prices every week because who doesn't love a good deal?",
          },
          {
            icon: FaShoppingBasket,
            title: 'Wide Selection',
            description:
              "From snacks to veggies, I've got all your munchies covered.",
          },
          {
            icon: FaChartLine,
            title: 'Price History',
            description:
              'Track the price trends of your favorite products over time to make informed buying decisions.',
          },
        ].map((feature, index) => (
          <div key={index} className="feature-item">
            <feature.icon className="feature-icon" />
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="about-story">
        <h2>My Story</h2>
        <p>
          My partner and I are always on the hunt for great deals, and that's
          how Half-Price Groceries came to life. It's a personal project I
          started to help myself, my wonderful partner, and others like us find
          the best grocery bargains. While it's still a work in progress, I'm
          thoroughly enjoying the process in my spare time. I hope you find it
          helpful!
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
