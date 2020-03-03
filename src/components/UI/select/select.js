import React from 'react';

const Select = (props) => {
  const { id, options, label, name, onChange, defaultValue } = props;
  const htmlFor = id;
  const cls = ['form-group'];

  return (
    <div className={cls.join(' ')}>
      <label htmlFor={htmlFor}>{label}</label>
      <select id={htmlFor} name={name} value={defaultValue} onChange={onChange}>
        {options.map((c, index) => (
          <option value={c.value} key={index}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
