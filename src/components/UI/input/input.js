import React from 'react';

const Input = (props) => {
  const inputType = props.type || 'text';
  const autocomplete = props.autocomplete || 'on';
  const htmlFor = props.id;
  function isInvalid({ valid, touched, shouldValidation }) {
    return !valid && touched && shouldValidation;
  }

  return (
    <div className={isInvalid(props) ? `form-group invalid` : `form-group`}>
      <label htmlFor={htmlFor}>{props.label}</label>
      <input type={inputType} id={htmlFor} value={props.value} onChange={props.onChange} autoComplete={autocomplete} />
      {isInvalid(props) ? <span>{props.errorMessage}</span> : null}
    </div>
  );
};

export default Input;
