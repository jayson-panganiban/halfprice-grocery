import React, { useMemo } from 'react';
import {
  Bread,
  Egg,
  Package,
  Snowflake,
  Coffee,
  FirstAidKit,
  Broom,
  BabyCarriage,
  PawPrint,
  Shrimp,
} from '@phosphor-icons/react';

import '../styles/components/CategoryFilter.css';

const categories = [
  { name: 'All', icon: null },
  { name: 'Household', icon: Broom },
  { name: 'Health & Beauty', icon: FirstAidKit },
  { name: 'Pantry', icon: Package },
  { name: 'Bakery', icon: Bread },
  { name: 'Dairy, Eggs & Fridge', icon: Egg },
  { name: 'Freezer', icon: Snowflake },
  { name: 'Drinks', icon: Coffee },
  { name: 'Baby', icon: BabyCarriage },
  { name: 'Pet', icon: PawPrint },
  { name: 'Meat & Seafood', icon: Shrimp },
  { name: 'Other', icon: null },
];

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const categoryButtons = useMemo(() => {
    return categories.map((category) => (
      <button
        key={category.name}
        className={`category-button ${
          selectedCategory === category.name ? 'active' : ''
        }`}
        onClick={() => onCategoryChange(category.name)}
      >
        {category.icon && <category.icon className="category-icon" />}
        <span className="category-name">{category.name}</span>
      </button>
    ));
  }, [selectedCategory, onCategoryChange]);

  return <div className="category-filter">{categoryButtons}</div>;
}

export default React.memo(CategoryFilter);
