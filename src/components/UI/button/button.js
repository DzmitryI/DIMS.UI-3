import React from 'react';
import { ThemeContext } from '../../context';
import { Link } from 'react-router-dom';

const Button = ({ type = 'button', id, name, className, onClick, disabled = false, to, theme }) => {
  id = id || name;
  let result = name;
  if (to) {
    result = <Link to={to}>{name}</Link>;
  }
  return (
    <button type={type} className={`${className} ${theme}--btn`} onClick={onClick} disabled={disabled} id={id}>
      {result}
    </button>
  );
};

export default (props) => (
  <ThemeContext.Consumer>{(theme) => <Button {...props} theme={theme} />}</ThemeContext.Consumer>
);
