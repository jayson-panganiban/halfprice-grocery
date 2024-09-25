import React from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import '../styles/components/ErrorMessage.css';

function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <WarningCircle size={32} weight="light" />
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
