import React from 'react';
import { ThemeContext } from '../../context';

const Footer = () => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <footer className={`footer--${theme}`}>
          <span>
            <sup>&copy;</sup> 2020 Devincubator.
          </span>
        </footer>
      )}
    </ThemeContext.Consumer>
  );
};

export default Footer;
