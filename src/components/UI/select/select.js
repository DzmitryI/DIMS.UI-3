import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ id, options, label, name, onChange, defaultValue, disabled }) => {
  return (
    <div className='form-group'>
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

Select.defaultProps = {
  disabled: false,
  options: [],
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
};

export default Select;
