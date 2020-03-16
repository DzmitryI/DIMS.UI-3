import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const links = [
    { to: '/MembersGrid', label: 'Members Grid' },
    { to: '/TasksGrid', label: 'Tasks Grid' },
    { to: '/MemberTasksGrid', label: 'Member Tasks Grid' },
  ];
  const renderLinks = () => {
    return links.map((link, index) => {
      return (
        <li key={link.to + index}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </li>
      );
    });
  };
  return (
    <div className='header'>
      <h3>
        <NavLink to='/'>DIMS</NavLink>
      </h3>
      <ul className='nav'>{renderLinks()}</ul>
    </div>
  );
};

export default Header;
