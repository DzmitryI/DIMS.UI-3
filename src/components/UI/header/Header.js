import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ButtonLink from '../buttonLink';
import ColorSwitch from '../../colorSwitch';
import DropDownMenu from '../dropDownMenu';
import { TABLE_ROLES } from '../../helpersComponents';
import { logout } from '../../../store/actions/auth';
import { withTheme } from '../../../hoc';
import imgMain from '../../../assets/images/main.png';

const Header = (props) => {
  const { isAuthenticated, email, theme } = props;
  let links = [];

  const renderLinks = (links) => {
    return links.map((link) => (
      <li key={link.to}>
        <NavLink to={link.to}>{link.label}</NavLink>
      </li>
    ));
  };

  if (isAuthenticated && (email === TABLE_ROLES.ADMIN || email === TABLE_ROLES.MENTOR)) {
    links = links.concat({ to: '/MembersGrid', label: 'Members Grid' });
    links = links.concat({ to: '/TasksGrid', label: 'Tasks Grid' });
  } else if (isAuthenticated) {
    links = [].concat({ to: '/MemberTasksGrid', label: 'Member Tasks Grid' });
  }

  return (
    <div className={`header header--${theme} ${theme}`}>
      <div className='imgMain-wrap'>
        <NavLink to='/'>
          <img src={imgMain} alt='img home' />
        </NavLink>
      </div>
      <ul className='nav'>{renderLinks(links)}</ul>
      <ColorSwitch />
      <DropDownMenu to='/AboutApp' />
      <ButtonLink className='btn-logout' onClick={props.logout} name='Logout' to='/Auth' />
    </div>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
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
