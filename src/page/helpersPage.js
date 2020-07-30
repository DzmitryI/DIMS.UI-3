import React from 'react';
import Input from '../components/UI/input';

function clearObjectValue(objInput, objElem) {
  const objInputClear = { ...objInput };
  const objElemClear = { ...objElem };
  Object.keys(objInputClear).forEach((key) => {
    if (objInputClear[key]) {
      objInputClear[key].value = '';
      objInputClear[key].touched = false;
      objInputClear[key].valid = false;
    }
  });
  Object.keys(objElemClear).forEach((key) => {
    if (key === 'directionId') {
      objElemClear[key] = 'direction1';
    } else if (key === 'sex') {
      objElemClear[key] = 'sex1';
    } else if (['startDate', 'deadlineDate', 'birthDate', 'trackDate'].includes(key)) {
      objElemClear[key] = new Date();
    } else {
      objElemClear[key] = '';
    }
  });

  const res = {
    objInputClear,
    objElemClear,
  };
  return res;
}

function updateInput(objInput, objValues) {
  const objInputUpdate = { ...objInput };
  Object.entries(objValues).forEach(([key, value]) => {
    if (objInputUpdate[key]) {
      objInputUpdate[key].value = value;
      objInputUpdate[key].touched = true;
      objInputUpdate[key].valid = true;
    }
  });
  return objInputUpdate;
}

function renderInputs(inputs, disabled, onChange, onBlur, onFocus, className = '') {
  return Object.keys(inputs).map((controlName) => {
    const { type, value, touched, valid, label, errorMessage, validation, placeholder } = inputs[controlName];
    return (
      <Input
        key={controlName}
        id={controlName}
        type={type}
        value={value}
        valid={valid}
        touched={touched}
        label={label}
        disabled={disabled}
        errorMessage={errorMessage}
        shouldValidation={!!validation}
        onChange={onChange(controlName)}
        placeholder={placeholder}
        className={className}
        onBlur={onBlur(controlName)}
        onFocus={onFocus(controlName)}
      />
    );
  });
}

export { clearObjectValue, updateInput, renderInputs };
