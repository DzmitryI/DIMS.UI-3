import React from 'react';

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

export default Radio;
