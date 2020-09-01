import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTheme } from '../../../hoc';

const DropDownMenu = ({ arrDropDownMenu, theme }) => {
  const burgerMenu = useRef(null);
  const dropdownMenuClick = () => {
    burgerMenu.current.classList.toggle('show');
    burgerMenu.current.classList.toggle('close');
  };

  return (
    <div className='dropdown-menu' onClick={dropdownMenuClick}>
      <div className={`burger-line first burger-line--${theme}`} />
      <div className={`burger-line second burger-line--${theme}`} />
      <div className={`burger-line third burger-line--${theme}`} />
      <nav className='burger-menu close' ref={burgerMenu}>
        {arrDropDownMenu.length &&
          arrDropDownMenu.map((curMenu) => {
            const { to, name, click } = curMenu;
            return (
              <li key={to} onClick={click}>
                <Link to={to} className={`burger-menu-item burger-menu-item--${theme}`}>
                  {name}
                </Link>
              </li>
            );
          })}
    </div>
  );
};

DropDownMenu.propTypes = {
  arrDropDownMenu: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
};

export default withTheme(DropDownMenu);
