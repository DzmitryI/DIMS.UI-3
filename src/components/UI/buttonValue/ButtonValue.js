import React from 'react';
import PropTypes from 'prop-types';
import './buttonValue.scss';

const ButtonValue = ({ src, name, width }) => {
  return (
    <>
      <span>
        <img src={src} width={width} alt={`logo ${name}`} />
      </span>
      <span className='authServiceTitle'>{name}</span>
    </>
  );
};

ButtonValue.defaultProps = {
  width: '18px',
};

ButtonValue.propsType = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
};

export default ButtonValue;
