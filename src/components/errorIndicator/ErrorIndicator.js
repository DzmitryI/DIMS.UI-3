import React from 'react';
import PropTypes from 'prop-types';
import imgError from '../../assets/images/error.png';
import './errorIndicator.scss';

const ErrorIndicator = ({ errorMessage }) => {
  return (
    <div className='error-wrap'>
      <img src={imgError} width='128px' alt='img error' />
      <span>{errorMessage}</span>
      <span>(but we already to fix it)</span>
    </div>
  );
};

ErrorIndicator.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorIndicator;
