import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../themContext/themContext';

const ButtonLink = ({ type = 'button', id, name, className, onClick, disabled = false, to, theme }) => {
  id = id || name;
  return (
    <button type={type} className={`${className} ${theme}--btn`} onClick={onClick} disabled={disabled} id={id}>
      <Link to={to}>{name}</Link>
    </button>
  );
};

export default (props) => (
  <ThemeContext.Consumer>{(theme) => <ButtonLink {...props} theme={theme} />}</ThemeContext.Consumer>
);
