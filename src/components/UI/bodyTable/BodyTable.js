import React from 'react';
import PropTypes from 'prop-types';

const BodyTable = ({ arr }) =>
  arr.map((arrTd, index) => {
    const renderItems = (bodies) =>
      bodies.map(({ className, value }, index) => (
        <td key={className + index} className={className}>
          {value}
        </td>
      ));
    return <tr key={arrTd + index}>{renderItems(arrTd)}</tr>;
  });

BodyTable.propTypes = {
  arr: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
};

export default BodyTable;
