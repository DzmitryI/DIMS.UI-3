import React from 'react';

const Select = (props) => {
  const { id, options, label, name, onChange, defaultValue } = props;
  const htmlFor = id;

  return (
    <div className={`form-group`}>
      <label htmlFor={htmlFor}>{label}</label>
      <select id={htmlFor} name={name} value={defaultValue} onChange={onChange}>
        {options.map((elem, index) => (
          <option value={elem.value} key={index}>
            {elem.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
