import React from 'react';
import PropTypes from 'prop-types';

const BodyTable = ({ arr }) =>
  arr.map((arr, index) => {
    const renderItems = (bodies) =>
      bodies.map(({ className, value }, index) => (
        <td key={className + index} className={className}>
          {value}
        </td>
      ));
    return <tr key={index}>{renderItems(arr)}</tr>;
  });

BodyTable.propTypes = {
  arr: PropTypes.array,
};

export default BodyTable;
