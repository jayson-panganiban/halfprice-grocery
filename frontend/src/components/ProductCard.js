import React from "react";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Price: {product.price}</p>
      <p>Price per unit: {product.pricePerUnit}</p>
      <p>Brand: {product.brand}</p>
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        View on {product.brand}
      </a>
    </div>
  );
}

export default ProductCard;
