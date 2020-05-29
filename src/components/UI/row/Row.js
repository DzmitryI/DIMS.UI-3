import React from 'react';
import { useDrag } from 'react-dnd';

const Row = ({ id, value }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'row' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <tr id={id} ref={drag}>
      {value}
    </tr>
  );
};

export default Row;
