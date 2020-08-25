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
      let { name, className } = header;
      let sortSpan = false;
      if (!role && name === 'Track') {
        name = '';
      } else if (!role && name === 'Available only for Admin') {
        name = 'track';
      }
      if (name.length && !set.has(name)) {
        sortSpan = true;
      }
      return (
        <th key={name + index} className={name.toLowerCase()}>
          {header.name}
          &nbsp;
          {sortSpan ? (
            <>
              <span className={`up ${className}`} onClick={onClick}>
                &#9650;
              </span>
              <span className={`down ${className}`} onClick={onClick}>
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
  email: PropTypes.string.isRequired,
  onClick: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.instanceOf(null)]),
};

export default withRole(HeaderTable);
