import React from 'react';
import { X } from 'phosphor-react';
import '../styles/components/CloseButton.css';

function CloseButton({ onClick }) {
  return (
    <button className="close-button" onClick={onClick}>
      <X size={24} />
    </button>
  );
}

export default CloseButton;
