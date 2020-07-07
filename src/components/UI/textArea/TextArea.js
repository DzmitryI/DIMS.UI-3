import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({ value, onChange, label, id, name, disabled, rows, className }) => {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} name={name} disabled={disabled} value={value} rows={rows} onChange={onChange} />
    </div>
  );
};

TextArea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  rows: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TextArea.defaultProps = {
  id: 'trackNote',
  name: 'note',
  disabled: false,
  className: 'form-group',
  rows: '7',
};

export default TextArea;
