import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ButtonLink from '../buttonLink';

export default class Header extends Component {
  links = [
    { to: '/MembersGrid', label: 'Members Grid' },
    { to: '/TasksGrid', label: 'Tasks Grid' },
    // { to: '/MemberTasksGrid', label: 'Member Tasks Grid' },
  ];
  logoutClick = () => {
    this.props.logout();
  };
  renderLinks = () => {
    return this.links.map((link, index) => {
      return (
        <li key={link.to + index}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </li>
      );
    });
  };
  render() {
    return (
      <div className='header'>
        <h3>
          <NavLink to='/'>DIMS</NavLink>
        </h3>
        <ul className='nav'>{this.renderLinks()}</ul>
        <ButtonLink className='btn btn-tasks' onClick={this.logoutClick} name='Logout' to={'/Auth'} />
      </div>
    );
  }
}

// export default Header;
