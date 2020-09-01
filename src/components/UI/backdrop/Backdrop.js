import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as actions from '../../../redux/actions/statusThePage';

const Backdrop = ({
  statusThePageChart,
  statusThePageMember,
  statusThePageTask,
  statusThePageTrack,
  className = '',
}) => {
  function onClick({ target: { classList } }) {
    if (classList.contains('backdrop-chart')) {
      statusThePageChart();
    } else if (classList.contains('backdrop-member')) {
      statusThePageMember();
    } else if (classList.contains('backdrop-task')) {
      statusThePageTask();
    } else if (classList.contains('backdrop-track')) {
      statusThePageTrack();
    }
  }
  return <div className={`backdrop ${className}`} onClick={onClick} />;
};

Backdrop.propTypes = {
  statusThePageChart: PropTypes.func.isRequired,
  statusThePageMember: PropTypes.func.isRequired,
  statusThePageTask: PropTypes.func.isRequired,
  statusThePageTrack: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  const { statusThePageChart, statusThePageMember, statusThePageTask, statusThePageTrack } = bindActionCreators(
    actions,
    dispatch,
  );
  return {
    statusThePageChart,
    statusThePageMember,
    statusThePageTask,
    statusThePageTrack,
  };
};

export default connect(null, mapDispatchToProps)(Backdrop);
