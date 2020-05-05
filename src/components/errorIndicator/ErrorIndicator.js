import React from 'react';
import imgError from '../../assets/images/error.png';
import './errorIndicator.scss';
import PropTypes from 'prop-types';

const ErrorIndicator = ({ errorMessage }) => {
  return (
    <div className='error-wrap'>
      <img src={imgError} width='128' alt='img error' />
      <span>{errorMessage}</span>
      <span>(but we already to fix it)</span>
    </div>
  );
};

ErrorIndicator.propTypes = {
  errorMessage: PropTypes.string,
};

export default ErrorIndicator;
