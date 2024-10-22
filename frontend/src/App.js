import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const ProductList = lazy(() => import('./components/ProductList'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="App">
          <Helmet>
            <title>HalfPrice Grocery - Half-price Grocery Specials</title>
            <meta
              name="description"
              content="Discover the best half-price grocery specials from Coles and Woolworths at HalfPrice Grocery."
            />
          </Helmet>
          <Header />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
