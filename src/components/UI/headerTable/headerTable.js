import React from 'react';

const HeaderTable = ({ arr }) => {
  const renderItems = (headers) => {
    return headers.map((header) => {
      return <th key={header}>{header}</th>;
    });
  };
  return <tr>{renderItems(arr)}</tr>;
};

export default HeaderTable;
