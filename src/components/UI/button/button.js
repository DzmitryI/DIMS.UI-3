import React from 'react';

const Button = ({ type = 'button', id, name, className, onClick, disabled = false }) => {
  id = typeof id !== 'undefined' ? id : name;
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled} id={id}>
      {name}
    </button>
  );
};

export default Button;
