import React from 'react';
import Button from '../button';
import ColorSwitch from '../../../components/colorSwitch';
import { TABLE_ROLES } from '../../helpersComponents';
import { NavLink } from 'react-router-dom';
import { ThemeContext, RoleContext } from '../../context';
import { connect } from 'react-redux';
import { logout } from '../../../store/actions/auth';

const Header = (props) => {
  const renderLinks = (links) => {
    return links.map((link) => {
      return (
        <li key={link.to}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </li>
      );
    });
  };
  const email = localStorage.getItem('email');
  const { isAuthenticated, theme } = props;
  const links = [];

  if (isAuthenticated && (email === TABLE_ROLES.ADMIN || email === TABLE_ROLES.MENTOR)) {
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
      <Button className='btn btn-tasks' onClick={props.logout} name='Logout' to={'/Auth'} />
      <ColorSwitch theme={props.theme} onColorSwitchClickHandler={props.onColorSwitchClickHandler} />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};
export default connect(
  null,
  mapDispatchToProps,
)((props) => (
  <ThemeContext.Consumer>
    {(them) => (
      <RoleContext.Consumer>{(email) => <Header {...props} email={email} them={them} />}</RoleContext.Consumer>
    )}
  </ThemeContext.Consumer>
));
