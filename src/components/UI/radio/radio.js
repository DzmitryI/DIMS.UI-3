import React from 'react';
import PropTypes from 'prop-types';

const Radio = ({ type, className, value, name, checked, onClick, label }) => {
  return (
    <label>
      <input type={type} className={className} value={value} name={name} defaultChecked={checked} onClick={onClick} />
      {label}
    </label>
  );
};

Radio.defaultProps = {
  type: 'radio',
  className: 'radio',
  name: 'base',
};

Radio.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default Radio;
