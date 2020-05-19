import React from 'react';
import PropTypes from 'prop-types';
import imgMail from '../../../assets/images/mail.png';
import imgGit from '../../../assets/images/git.png';
import SocialLink from '../socialLink';
import { withTheme } from '../../../hoc';

const Footer = ({ theme }) => {
  const date = new Date();
  return (
    <footer className={`footer--${theme}`}>
      <div className='footer-link__wrap'>
        <SocialLink href='mailto:dmitriy.ivanou@gmail.com' src={imgMail} alt='mail icon' />
        <SocialLink href='https://github.com/DzmitryI' src={imgGit} alt='git icon' />
      </div>
      <span>&copy; {date.getFullYear()} Dev Incubator</span>
    </footer>
  );
};

Footer.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default withTheme(Footer);
