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
  className,
  pattern,
}) => {
  const result = isInvalid(valid, touched, shouldValidation);
  return (
    <div className={`form-group ${className} ${result ? 'invalid' : ''}`}>
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
        min='0'
        pattern={pattern}
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
  errorMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  className: PropTypes.string,
  valid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

Input.defaultProps = {
  type: 'text',
  autocomplete: 'off',
  disabled: false,
  placeholder: '',
  className: '',
  onBlur: null,
  onFocus: null,
  pattern: null,
  errorMessage: '',
};

export default Input;
