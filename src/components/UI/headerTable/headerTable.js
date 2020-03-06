import React from 'react';

const HeaderTable = ({ arr }) => {
  const renderItems = (arr) => {
    return arr.map((el) => {
      return <th>{el}</th>;
    });
  };

  const items = renderItems(arr);
  return <tr>{items}</tr>;
};

export default HeaderTable;
