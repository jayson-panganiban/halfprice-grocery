import React from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import '../styles/components/NoResults.css';

function NoResults() {
  return (
    <div className="no-results">
      <MagnifyingGlass size={32} weight="light" />
      <p>No products found matching your search.</p>
      <p>Try adjusting your search or selecting a different category.</p>
    </div>
  );
}

export default NoResults;
