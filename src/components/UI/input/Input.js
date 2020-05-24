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
  onBlur,
  onFocus,
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
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <span className={`invalid-text ${result ? 'visibility' : ''}`}>{errorMessage}</span>
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  autocomplete: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  touched: PropTypes.bool.isRequired,
  shouldValidation: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  valid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

Input.defaultProps = {
  type: 'text',
  autocomplete: 'on',
  disabled: false,
  placeholder: '',
};

export default Input;
