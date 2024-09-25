import React, { useState, useEffect } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import '../styles/components/SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <form className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="search-input"
      />
      {searchTerm && (
        <button type="button" className="clear-button" onClick={handleClear}>
          <X size={18} />
        </button>
      )}
      <button type="submit" className="search-button">
        <MagnifyingGlass size={24} />
      </button>
    </form>
  );
}

export default SearchBar;
