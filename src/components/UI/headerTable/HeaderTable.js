import React from 'react';
import PropTypes from 'prop-types';

const HeaderTable = ({ arr }) => {
  const renderItems = (headers) => headers.map((header, index) => <th key={header + index}>{header}</th>);
  return <tr>{renderItems(arr)}</tr>;
};

HeaderTable.defaultProps = {
  arr: [],
};

HeaderTable.propTypes = {
  arr: PropTypes.array.isRequired,
};

export default HeaderTable;
