import React from 'react';

const Button = ({ type = 'button', name, className, onClick, disabled = false }) => {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {name}
    </button>
  );
};

export default Button;
