import React from 'react';
import { RoleContextCosumer } from '../components/context';

const withRole = (Wrapped) => {
  (props) => {
    return <RoleContextCosumer>{(email) => <Wrapped {...props} email={email} />}</RoleContextCosumer>;
  };
};

export default withRole;
