import React from 'react';
import { ThemeContext } from '../context';

const Spinner = (props) => {
  return (
    <div className={`loadingio-spinner-ripple ${props.theme}`}>
      <div className='ldio'>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default (props) => (
  <ThemeContext.Consumer>{(theme) => <Spinner {...props} theme={theme} />}</ThemeContext.Consumer>
);
