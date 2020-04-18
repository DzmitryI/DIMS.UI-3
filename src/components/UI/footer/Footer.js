import React from 'react';
import { withTheme } from '../../../hoc';

const Footer = ({ theme }) => {
  return (
    <footer className={`footer--${theme}`}>
      <span>
        <sup>&copy;</sup> 2020 Devincubator.
      </span>
    </footer>
  );
};

export default withTheme(Footer);
