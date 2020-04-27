import React from 'react';
import { withTheme } from '../../../hoc';

const Button = ({ type, id, name, className, onClick, disabled, theme }) => {
  id = id || name;
  return (
    <button type={type} className={`btn ${className} ${theme}--btn`} onClick={onClick} disabled={disabled} id={id}>
      {name}
    </button>
  );
};

Button.defaultProps = {
  type: 'button',
  className: 'btn-add',
  disabled: false,
};

export default withTheme(Button);
