import React from 'react';
import { withTheme } from '../../hoc';

const Spinner = ({ theme }) => {
  return (
    <div className={`loadingio-spinner-ripple ${theme}`}>
      <div className='ldio'>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default withTheme(Spinner);
