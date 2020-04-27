import React from 'react';
import imgMail from '../../../assets/images/mail.png';
import imgGit from '../../../assets/images/git.png';
import { withTheme } from '../../../hoc';

const Footer = ({ theme }) => {
  return (
    <footer className={`footer--${theme}`}>
      <div className='footer-link__wrap'>
        <div className='imgMain-wrap'>
          <a href='mailto:dmitriy.ivanou@gmail.com'>
            <img src={imgMail} width='28px' alt='mail icon' />
          </a>
        </div>
        <div className='imgMain-wrap'>
          <a href='https://github.com/DzmitryI'>
            <img src={imgGit} width='28px' alt='git icon' />
          </a>
        </div>
      </div>
      <span>
        <sup>&copy;</sup> 2020 Devincubator.
      </span>
    </footer>
  );
};

export default withTheme(Footer);
