import React from 'react';
import ButtonLink from '../buttonLink';
import ColorSwitch from '../../../components/colorSwitch';
import { tableRoles } from '../../helpersComponents';
import { NavLink } from 'react-router-dom';
import { ThemeContext, RoleContext } from '../../context';

const Header = (props) => {
  const logoutClick = () => {
    props.logout();
  };

  const renderLinks = (links) => {
    return links.map((link) => {
      return (
        <li key={link.to}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </li>
      );
    });
  };

  const { isAuthenticated, email, theme } = props;
  const links = [];

  if (isAuthenticated && (email === tableRoles.get('admin') || email === tableRoles.get('mentor'))) {
    links.push({ to: '/MembersGrid', label: 'Members Grid' });
    links.push({ to: '/TasksGrid', label: 'Tasks Grid' });
  } else if (isAuthenticated) {
    links.push({ to: '/MemberTasksGrid', label: 'Member Tasks Grid' });
  }

  return (
    <div className={`header ${theme}`}>
      <h3>
        <NavLink to='/'>DIMS</NavLink>
      </h3>
      <ul className='nav'>{renderLinks(links)}</ul>
      <ButtonLink className='btn btn-tasks' onClick={logoutClick} name='Logout' to={'/Auth'} />
      <ColorSwitch theme={props.theme} onColorSwitchClickHandler={props.onColorSwitchClickHandler} />
    </div>
  );
};

export default (props) => (
  <ThemeContext.Consumer>
    {(them) => (
      <RoleContext.Consumer>{(email) => <Header {...props} email={email} them={them} />}</RoleContext.Consumer>
    )}
  </ThemeContext.Consumer>
);
