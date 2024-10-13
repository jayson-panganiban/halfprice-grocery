import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import About from './components/About';
import Footer from './components/Footer';
import Contact from './components/Contact';

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
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
