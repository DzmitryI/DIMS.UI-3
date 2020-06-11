import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ButtonLink from '../buttonLink';
import ColorSwitch from '../../colorSwitch';
import DropDownMenu from '../dropDownMenu';
import { TABLE_ROLES } from '../../helpersComponents';
import { logout } from '../../../store/actions/auth';
import { withTheme } from '../../../hoc';
import imgMain from '../../../assets/images/main.png';

const Header = (props) => {
  const { isAuthenticated, email, theme, logout } = props;
  let arrLinks = [];

  const renderLinks = (links) => {
    return links.map((link) => (
      <li key={link.to}>
        <NavLink to={link.to}>{link.label}</NavLink>
      </li>
    ));
  };

  if (isAuthenticated && (email === TABLE_ROLES.ADMIN || email === TABLE_ROLES.MENTOR)) {
    arrLinks = arrLinks.concat({ to: '/MembersGrid', label: 'Members Grid' });
    arrLinks = arrLinks.concat({ to: '/TasksGrid', label: 'Tasks Grid' });
  } else if (isAuthenticated) {
    arrLinks = [].concat({ to: '/MemberTasksGrid', label: 'Member Tasks Grid' });
  }

  return (
    <div className={`header header--${theme} ${theme}`}>
      <div className='imgMain-wrap'>
        <NavLink to='/'>
          <img src={imgMain} alt='img home' />
        </NavLink>
      </div>
      <ul className='nav'>{renderLinks(arrLinks)}</ul>
      <ColorSwitch />
      <DropDownMenu to='/AboutApp' />
      <ButtonLink className='btn-logout' onClick={logout} name='Logout' to='/Auth' />
    </div>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { email } }) => {
  return {
    email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Header));
