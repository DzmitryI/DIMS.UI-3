import React from 'react';

const HeaderTable = ({ arr }) => {
  const renderItems = (headers) => {
    return headers.map((header, index) => {
      return <th key={header + index}>{header}</th>;
    });
  };

  const items = renderItems(arr);
  return <tr>{items}</tr>;
};

export default HeaderTable;
