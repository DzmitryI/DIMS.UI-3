import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ButtonLink from '../buttonLink';
import { tableRoles } from '../../helpersComponents';

export default class Header extends Component {
  logoutClick = () => {
    this.props.logout();
  };

  renderLinks = (links) => {
    return links.map((link) => {
      return (
        <li key={link.to}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </li>
      );
    });
  };

  render() {
    const { isAuthenticated, email } = this.props;
    const links = [];

    if (isAuthenticated && (email === tableRoles.get('admin') || email === tableRoles.get('mentor'))) {
      links.push({ to: '/MembersGrid', label: 'Members Grid' });
      links.push({ to: '/TasksGrid', label: 'Tasks Grid' });
    } else if (isAuthenticated) {
      links.push({ to: '/MemberTasksGrid', label: 'Member Tasks Grid' });
    }

    return (
      <div className='header'>
        <h3>
          <NavLink to='/'>DIMS</NavLink>
        </h3>
        <ul className='nav'>{this.renderLinks(links)}</ul>
        <ButtonLink className='btn btn-tasks' onClick={this.logoutClick} name='Logout' to={'/Auth'} />
      </div>
    );
  }
}
