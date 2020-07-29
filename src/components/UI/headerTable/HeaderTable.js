import React from 'react';
import PropTypes from 'prop-types';
import { withRole } from '../../../hoc';
import { TABLE_ROLES } from '../../helpersComponentPageMaking';

const HeaderTable = ({ arr, email, onClick }) => {
  const { isAdmin, isMentor } = TABLE_ROLES;
  const role = email === isAdmin || email === isMentor;
  const set = new Set();
  set.add('Track');
  set.add('Available only for Admin');

  const renderItems = (headers, role) => {
    return headers.map((header, index) => {
      let sortSpan = false;
      if (!role && header.name === 'Track') {
        header.name = '';
      } else if (!role && header.name === 'Available only for Admin') {
        header.name = 'track';
      }
      if (header.name.length && !set.has(header.name)) {
        sortSpan = true;
      }
      return (
        <th key={header.name + index} className={header.name.toLowerCase()}>
          {header.name}&nbsp;
          {sortSpan ? (
            <>
              <span className={`up ${header.className}`} onClick={onClick}>
                &#9650;
              </span>
              <span className={`down ${header.className}`} onClick={onClick}>
                &#9660;
              </span>
            </>
          ) : null}
        </th>
      );
    });
  };
  return <tr>{renderItems(arr, role)}</tr>;
};

HeaderTable.defaultProps = {
  arr: [],
};

HeaderTable.propTypes = {
  arr: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default withRole(HeaderTable);
