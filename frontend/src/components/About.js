import React from 'react';
import { Leaf, ShoppingCart, ChartLine, Coffee } from 'phosphor-react';
import '../styles/components/About.css';

const About = () => {
  return (
    <div className="about-container">
      <p className="mission-statement gradient-text">
        Helping fellow bargain hunters find the best grocery deals, one click at
        a time!
      </p>

      <div className="feature-grid">
        {[
          {
            icon: Leaf,
            title: 'Fresh Deals Weekly',
            description:
              "I update the prices every week because who doesn't love a good deal?",
          },
          {
            icon: ShoppingCart,
            title: 'Wide Selection',
            description:
              "From snacks to veggies, I've got all your munchies covered.",
          },
          {
            icon: ChartLine,
            title: 'Price History',
            description:
              'Track the price trends of your favorite products over time to make informed buying decisions.',
          },
        ].map((feature, index) => (
          <div key={index} className="feature-item">
            <feature.icon size={32} className="feature-icon animate-icon" />
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="about-story">
        <h2>Story</h2>
        <p>
          Halfprice Grocery is a hobby project I started to help myself and my
          wonderful partner find halfprice grocery specials. It's an evolving
          platform that I'm excited to develop in my free time. Happy savings!
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
          className="coffee-button hover-effect"
          onClick={() =>
            window.open('https://www.buymeacoffee.com/jsonpanganiban', '_blank')
          }
        >
          <Coffee size={24} />
          <span>Buy me a coffee</span>
        </button>
      </div>
    </div>
  );
};

export default About;
