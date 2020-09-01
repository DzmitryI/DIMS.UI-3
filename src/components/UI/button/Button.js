import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../../../hoc';

const Button = ({ type, id, name, className, onClick, disabled, theme }) => {
  id = id || name;
  return (
    <button type={type} className={`btn ${className} ${theme}--btn`} onClick={onClick} disabled={disabled} id={id}>
      {name}
    </button>
  );
};

Button.defaultProps = {
  type: 'button',
  className: 'btn-add',
  disabled: false,
  id: null,
};

Button.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  theme: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

export default withTheme(Button);
