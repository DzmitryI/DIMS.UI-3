import React from 'react';

const Select = ({ id, options, label, name, onChange, defaultValue }) => {
  return (
    <div className={`form-group`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} value={defaultValue} onChange={onChange}>
        {options.map((elem, index) => (
          <option value={elem.value} key={elem.value + index}>
            {elem.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
