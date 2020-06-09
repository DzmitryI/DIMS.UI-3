import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

const Row = ({ id, value, index, moveRow }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'row',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [, drag] = useDrag({
    item: { type: 'row', id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <tr id={id} ref={ref}>
      {value}
    </tr>
  );
};

Row.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([PropTypes.symbol, PropTypes.object]).isRequired,
  moveRow: PropTypes.oneOfType([PropTypes.func]).isRequired,
};

export default Row;
