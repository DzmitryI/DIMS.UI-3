import React from 'react';
import { ThemeContext } from '../../context';

const Button = ({ type = 'button', id, name, className, onClick, disabled = false }) => {
  id = id || name;
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <button type={type} className={`${className} ${theme}--btn`} onClick={onClick} disabled={disabled} id={id}>
          {name}
        </button>
      )}
    </ThemeContext.Consumer>
  );
};

export default Button;
