import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { createNotify } from '../../services/helpers';
import 'react-toastify/dist/ReactToastify.css';

class DisplayNotification extends Component {
  componentDidMount() {
    const { status, title } = this.props.notification;
    this.notify(status, title);
  }

  notify = (status, title) => {
    if (status === 'success') {
      toast.success(title, createNotify());
    } else if (status === 'error') {
      toast.error(title, createNotify());
    }
  };

  render() {
    return (
      <div>
        <ToastContainer newestOnTop={false} rtl={false} pauseOnVisibilityChange={false} />
      </div>
    );
  }
}

DisplayNotification.propTypes = {
  status: PropTypes.string,
  title: PropTypes.string,
};

DisplayNotification.defaultProps = {
  status: 'success',
  title: '',
};

export default DisplayNotification;
