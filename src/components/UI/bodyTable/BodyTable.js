import React from 'react';

const BodyTable = ({ arr }) => {
  return arr.map((arr) => {
    const renderItems = (bodies) => {
      return bodies.map((body) => {
        return <td className={body.class}>{body.value}</td>;
      });
    };
    return <tr>{renderItems(arr)}</tr>;
  });
};

export default BodyTable;
