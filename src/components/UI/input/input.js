import React from 'react';
import PropTypes from 'prop-types';

function isInvalid(valid, touched, shouldValidation) {
  return !valid && touched && shouldValidation;
}

const Input = ({
  type,
  autocomplete,
  id,
  valid,
  touched,
  shouldValidation,
  label,
  value,
  onChange,
  errorMessage,
  disabled,
  placeholder,
}) => {
  const result = isInvalid(valid, touched, shouldValidation);
  return (
    <div className={`form-group ${result ? 'invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        key={id}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autocomplete}
      />
      {result && <span>{errorMessage}</span>}
    </div>
  );
};

Input.defaultProps = {
  type: 'text',
  autocomplete: 'on',
  disabled: false,
  placeholder: '',
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  autocomlete: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
};

export default Input;
