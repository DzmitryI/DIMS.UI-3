import React from 'react';
import imgError from '../../assets/images/error.png';
import './errorIndicator.scss';

const ErrorIndicator = () => {
  return (
    <div className='error-wrap'>
      <img src={imgError} alt='img error' />
      <span>Somethings broken</span>
      <span>(but we already to fix it)</span>
    </div>
  );
};

export default ErrorIndicator;
