import React from 'react';

const Cell = ({ className, value, id = null }) => {
  return (
    <td className={className} id={id}>
      {value}
    </td>
  );
};

Cell.defaultProps = {
  className: 'td',
};

export default Cell;
