import React from 'react';
import { ThemeContext } from '../context';

const spinner = () => {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div className={`loadingio-spinner-ripple ${theme}`}>
          <div className='ldio'>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default spinner;
