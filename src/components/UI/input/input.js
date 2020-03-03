import React from 'react';

const Input = (props) => {
  const inputType = props.type || 'text';
  const htmlFor = props.id;
  const cls = ['form-group'];
  function isInvalid({ valid, touched, shouldValidation }) {
    return !valid && touched && shouldValidation;
  }

  if (isInvalid(props)) {
    cls.push('invalid');
  }

  return (
    <div className={cls.join(' ')}>
      <label htmlFor={htmlFor}>{props.label}</label>
      <input type={inputType} id={htmlFor} value={props.value} onChange={props.onChange} />
      {isInvalid(props) ? <span>{props.errorMessage}</span> : null}
    </div>
  );
};

export default Input;
