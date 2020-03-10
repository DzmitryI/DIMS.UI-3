import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends Component {
  state = {
    links: [
      { to: '/MembersGrid', label: 'Members Grid' },
      { to: '/TasksGrid', label: 'Tasks Grid' },
      { to: '/MemberTasksGrid', label: 'Member Tasks Grid' },
    ],
  };

  renderLinks() {
    const { links } = this.state;
    return links.map((link, index) => {
      return (
        <li key={index}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </li>
      );
    });
  }

  render() {
    return (
      <div className='header'>
        <h3>
          <NavLink to='/'>DIMS</NavLink>
        </h3>
        <ul className='nav'>{this.renderLinks()}</ul>
      </div>
    );
  }
}
