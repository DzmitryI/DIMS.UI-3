import React from 'react';
import PropTypes from 'prop-types';
import Picker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ id, onChange, label, disabled, date }) => {
  return (
    <div key={id} className='form-group'>
      <label htmlFor={id}>{label}</label>
      <Picker selected={new Date(date)} id={id} disabled={disabled} onChange={onChange} />
    </div>
  );
};

DatePicker.defaultProps = {};

DatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
};

export default DatePicker;
