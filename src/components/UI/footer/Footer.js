import React from 'react';
import { ThemeContextConsumer } from '../../context';

const Footer = () => {
  return (
    <ThemeContextConsumer>
      {({ theme }) => (
        <footer className={`footer--${theme}`}>
          <span>
            <sup>&copy;</sup> 2020 Devincubator.
          </span>
        </footer>
      )}
    </ThemeContextConsumer>
  );
};

export default Footer;
