import React from 'react';
import PropTypes from 'prop-types';

const Cell = ({ className, value, id }) => {
  return (
    <td className={className} id={id}>
      {value}
    </td>
  );
};

Cell.defaultProps = {
  className: 'td',
  id: null,
};

Cell.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]).isRequired,
};

export default Cell;
