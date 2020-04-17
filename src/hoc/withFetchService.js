import React from 'react';
import { FetchServiceCosumer } from '../components/context';

const withFetchService = (Wrapped) => {
  return (props) => {
    return (
      <FetchServiceCosumer>{(fetchService) => <Wrapped {...props} fetchService={fetchService} />}</FetchServiceCosumer>
    );
  };
};

export default withFetchService;
