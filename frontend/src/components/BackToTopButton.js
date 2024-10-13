import React, { useState, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';
import { ArrowUp } from 'phosphor-react';
import '../styles/components/BackToTopButton.css';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500,
      smooth: 'easeInOutQuart',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`back-to-top ${isVisible ? 'visible' : ''}`}
          aria-label="Back to top"
        >
          <ArrowUp size={24} weight="bold" />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
