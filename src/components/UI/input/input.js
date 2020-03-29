import React from 'react';
function isInvalid(valid, touched, shouldValidation) {
  return !valid && touched && shouldValidation;
}
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
  const result = isInvalid(valid, touched, shouldValidation);
  return (
    <div className={result ? `form-group invalid` : `form-group`}>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} value={value} onChange={onChange} disabled={disabled} autoComplete={autocomplete} />
      {result ? <span>{errorMessage}</span> : null}
    </div>
  );
};

export default Input;
