import React from 'react';
import PropTypes from 'prop-types';

const BodyTable = ({ arr }) =>
  arr.map((arrTd) => {
    const renderItems = (bodies) =>
      bodies.map(({ className, value }, index) => (
        <td key={className + index} className={className}>
          {value}
        </td>
      ));
    return <tr key={arrTd}>{renderItems(arrTd)}</tr>;
  });

BodyTable.propTypes = {
  arr: PropTypes.array,
};

export default BodyTable;
