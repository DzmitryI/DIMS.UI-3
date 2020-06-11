import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withTheme } from '../../../hoc';

const DropDownMenu = ({ to, theme }) => {
  const burgerMenu = useRef(null);
  const dropdownMenuClick = () => {
    burgerMenu.current.classList.toggle('show');
  };

  return (
    <div className='dropdown-menu' onClick={dropdownMenuClick}>
      <div className={`burger-line first burger-line--${theme}`} />
      <div className={`burger-line second burger-line--${theme}`} />
      <div className={`burger-line third burger-line--${theme}`} />
      <nav className='burger-menu' ref={burgerMenu}>
        <li>
          <NavLink to={to} className='burger-menu-item'>
            About app
          </NavLink>
        </li>
      </nav>
    </div>
  );
};

DropDownMenu.propTypes = {
  to: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
};

export default withTheme(DropDownMenu);
