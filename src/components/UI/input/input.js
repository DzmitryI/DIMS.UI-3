import React from 'react';

const Input = ({
  type = 'text',
  autocomplete = 'on',
  id,
  valid,
  touched,
  shouldValidation,
  label,
  value,
  onChange,
  errorMessage,
  disabled = false,
}) => {
  function isInvalid(valid, touched, shouldValidation) {
    return !valid && touched && shouldValidation;
  }
  return (
    <div className={isInvalid(valid, touched, shouldValidation) ? `form-group invalid` : `form-group`}>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} value={value} onChange={onChange} disabled={disabled} autoComplete={autocomplete} />
      {isInvalid(valid, touched, shouldValidation) ? <span>{errorMessage}</span> : null}
    </div>
  );
};

export default Input;
