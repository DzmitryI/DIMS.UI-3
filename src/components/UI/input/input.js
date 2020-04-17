import React from 'react';

function isInvalid(valid, touched, shouldValidation) {
  return !valid && touched && shouldValidation;
}

const Input = (props) => {
  const {
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
  } = props;
  const result = isInvalid(valid, touched, shouldValidation);
  return (
    <div className={`form-group ${result ? 'invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
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

export default Input;
