import React, { useMemo, useCallback } from 'react';
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

const CategoryButton = React.memo(({ category, isActive, onClick }) => (
  <button
    className={`category-button ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {category.icon && <category.icon className="category-icon" />}
    <span className="category-name">{category.name}</span>
  </button>
));

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  const handleCategoryClick = useCallback(
    (categoryName) => () => onCategoryChange(categoryName),
    [onCategoryChange]
  );

  const categoryButtons = useMemo(() => {
    return categories.map((category) => (
      <CategoryButton
        key={category.name}
        category={category}
        isActive={selectedCategory === category.name}
        onClick={handleCategoryClick(category.name)}
      />
    ));
  }, [selectedCategory, handleCategoryClick]);

  return <div className="category-filter">{categoryButtons}</div>;
}

export default React.memo(CategoryFilter);
