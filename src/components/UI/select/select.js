import React from 'react';

const Select = (props) => {
  const { id, options, label, onChange } = props;
  const htmlFor = id;
  const cls = ['form-group'];
  console.log(options);

  return (
    <div className={cls.join(' ')}>
      <label htmlFor={htmlFor}>{label}</label>
      <select id={htmlFor} onChange={onChange}>
        {options.map((c, i) => (
          <option value={c.value} key={i}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
