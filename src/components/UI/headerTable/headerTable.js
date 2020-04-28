import React from 'react';

const HeaderTable = ({ arr }) => {
  const renderItems = (headers) => {
    return headers.map((header, index) => {
      return <th key={header + index}>{header}</th>;
    });
  };
  return <tr>{renderItems(arr)}</tr>;
};

export default HeaderTable;
