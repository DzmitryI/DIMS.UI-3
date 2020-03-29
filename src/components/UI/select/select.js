import React from 'react';

const Select = ({ id, options, label, name, onChange, defaultValue, disabled = false }) => {
  return (
    <div className={`form-group`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} value={defaultValue} disabled={disabled} onChange={onChange}>
        {options.map((elem) => (
          <option value={elem.value} key={`${elem.value}`}>
            {elem.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
