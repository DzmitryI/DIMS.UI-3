import React from 'react';
import { NavLink } from 'react-router-dom';
import { withTheme } from '../../../hoc';

const DropDownMenu = ({ to, theme }) => {
  const dropdownMenuClick = () => {
    const burgerMenu = document.querySelector('.burger-menu');
    burgerMenu.classList.toggle('show');
  };

  return (
    <div className='dropdown-menu' onClick={dropdownMenuClick}>
      <div className={`burger-line first burger-line--${theme}`}></div>
      <div className={`burger-line second burger-line--${theme}`}></div>
      <div className={`burger-line third burger-line--${theme}`}></div>
      <nav className='burger-menu'>
        <li>
          <NavLink to={to} className='burger-menu-item'>
            About app
          </NavLink>
        </li>
      </nav>
    </div>
  );
};

export default withTheme(DropDownMenu);
