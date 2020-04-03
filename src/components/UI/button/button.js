import React from 'react';
import { ThemeContext } from '../../themContext/themContext';

const Button = ({ type = 'button', id, name, className, onClick, disabled = false, theme }) => {
  id = id || name;
  return (
    <button type={type} className={`${className} ${theme}--btn`} onClick={onClick} disabled={disabled} id={id}>
      {name}
    </button>
  );
};

export default (props) => (
  <ThemeContext.Consumer>{(theme) => <Button {...props} theme={theme} />}</ThemeContext.Consumer>
);
