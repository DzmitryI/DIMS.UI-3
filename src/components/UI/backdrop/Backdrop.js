import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  statusThePageChart,
  statusThePageMember,
  statusThePageTask,
  statusThePageTrack,
} from '../../../redux/actions/statusThePage';

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

const mapDispatchToProps = (dispatch) => {
  return {
    statusThePageChart: bindActionCreators(statusThePageChart, dispatch),
    statusThePageMember: bindActionCreators(statusThePageMember, dispatch),
    statusThePageTask: bindActionCreators(statusThePageTask, dispatch),
    statusThePageTrack: bindActionCreators(statusThePageTrack, dispatch),
  };
};

export default connect(null, mapDispatchToProps)(Backdrop);
