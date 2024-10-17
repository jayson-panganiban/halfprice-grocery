import React from 'react';
import {
  Bread,
  Egg,
  Package,
  Snowflake,
  Coffee,
  BeerBottle,
  FirstAidKit,
  Broom,
  BabyCarriage,
  PawPrint,
} from '@phosphor-icons/react';

import '../styles/components/CategoryFilter.css';

const categories = [
  { name: 'All', icon: null },
  { name: 'Household', icon: Broom },
  { name: 'Pantry', icon: Package },
  { name: 'Dairy, Eggs & Fridge', icon: Egg },
  { name: 'Freezer', icon: Snowflake },
  { name: 'Drinks', icon: Coffee },
  { name: 'Liquor', icon: BeerBottle },
  { name: 'Health & Beauty', icon: FirstAidKit },
  { name: 'Bakery', icon: Bread },
  { name: 'Baby', icon: BabyCarriage },
  { name: 'Pet', icon: PawPrint },
];

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
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
      ))}
    </div>
  );
}

export default React.memo(CategoryFilter);
