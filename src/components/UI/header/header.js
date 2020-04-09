import React from 'react';
import Button from '../button';
import ColorSwitch from '../../../components/colorSwitch';
import { TABLE_ROLES } from '../../helpersComponents';
import { NavLink } from 'react-router-dom';
import { ThemeContext } from '../../context';
import { connect } from 'react-redux';
import { logout } from '../../../store/actions/auth';

const Header = (props) => {
  const { isAuthenticated, email } = props;
  let links = [];

  const renderLinks = (links) => {
    return links.map((link) => {
      return (
        <li key={link.to}>
          <NavLink to={link.to}>{link.label}</NavLink>
        </li>
      );
    });
  };

  if (isAuthenticated && (email === TABLE_ROLES.ADMIN || email === TABLE_ROLES.MENTOR)) {
    links = links.concat({ to: '/MembersGrid', label: 'Members Grid' });
    links = links.concat({ to: '/TasksGrid', label: 'Tasks Grid' });
  } else if (isAuthenticated) {
    links = [].concat({ to: '/MemberTasksGrid', label: 'Member Tasks Grid' });
  }

  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <div className={`header ${theme}`}>
          <h3>
            <NavLink to='/'>DIMS</NavLink>
          </h3>
          <ul className='nav'>{renderLinks(links)}</ul>
          <Button className='btn btn-tasks' onClick={props.logout} name='Logout' to={'/Auth'} />
          <ColorSwitch />
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

const mapStateToProps = (state) => {
  return {
    email: state.auth.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
