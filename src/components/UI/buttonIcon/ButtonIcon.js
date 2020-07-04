import React from 'react';
import PropTypes from 'prop-types';
import './buttonIcon.scss';

const ButtonIcon = ({ src, name, width }) => {
  return (
    <>
      <span>
        <img src={src} width={width} alt={`logo ${name}`} />
      </span>
      <span className='authServiceTitle'>{name}</span>
    </>
  );
};

ButtonIcon.defaultProps = {
  width: '18px',
};

ButtonIcon.propsType = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
};

export default ButtonIcon;
