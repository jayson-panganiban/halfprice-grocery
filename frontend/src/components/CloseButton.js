import React, { useCallback } from 'react';
import { X } from 'phosphor-react';
import '../styles/components/CloseButton.css';

const CloseButton = React.memo(({ onClick }) => {
  const handleClick = useCallback(
    (event) => {
      onClick(event);
    },
    [onClick]
  );

  return (
    <button
      className="close-button"
      onClick={handleClick}
      aria-label="Close"
      type="button"
    >
      <X size={24} weight="bold" />
    </button>
  );
});

export default CloseButton;
