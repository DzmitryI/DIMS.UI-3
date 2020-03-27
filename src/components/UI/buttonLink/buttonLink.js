import React from 'react';
import { Link } from 'react-router-dom';

const ButtonLink = ({ type = 'button', id, name, className, onClick, disabled = false, to }) => {
  id = typeof id !== 'undefined' ? id : name;
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled} id={id}>
      <Link to={to}>{name}</Link>
    </button>
  );
};

export default ButtonLink;
