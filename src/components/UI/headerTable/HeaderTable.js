import React from 'react';
import PropTypes from 'prop-types';
import { withRole } from '../../../hoc';
import { TABLE_ROLES } from '../../helpersComponentPageMaking';
const HeaderTable = ({ arr, email }) => {
  const { isAdmin, isMentor } = TABLE_ROLES;
  const role = email === isAdmin || email === isMentor;
  const renderItems = (headers, role) => {
    return headers.map((header, index) => {
      if (!role && header === 'Track') {
        header = '';
      } else if (!role && header === 'Available only for Admin') {
        header = 'track';
      }
      return (
        <th key={header + index} className={header.toLowerCase()}>
          {header}
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
