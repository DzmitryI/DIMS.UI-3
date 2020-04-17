import React from 'react';
import { withTheme } from '../../../hoc';

const Button = ({ type = 'button', id, name, className, onClick, disabled = false, theme }) => {
  id = id || name;
  return (
    <button type={type} className={`btn ${className} ${theme}--btn`} onClick={onClick} disabled={disabled} id={id}>
      {name}
    </button>
  );
};

export default withTheme(Button);
