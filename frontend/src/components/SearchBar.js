import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import '../styles/components/SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    (term) => {
      const handler = setTimeout(() => {
        onSearch(term);
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    },
    [onSearch]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchTerm);
    return cleanup;
  }, [searchTerm, debouncedSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch(searchTerm);
    },
    [onSearch, searchTerm]
  );

  const clearButton = useMemo(
    () =>
      searchTerm && (
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      ),
    [searchTerm, handleClear]
  );

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="search-input"
        aria-label="Search products"
      />
      {clearButton}
      <button
        type="submit"
        className="search-button"
        aria-label="Submit search"
      >
        <MagnifyingGlass size={24} />
      </button>
    </form>
  );
}

export default React.memo(SearchBar);
