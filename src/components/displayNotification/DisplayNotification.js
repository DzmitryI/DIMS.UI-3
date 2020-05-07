import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import { createNotify } from '../../services/helpers';
import 'react-toastify/dist/ReactToastify.css';

class DisplayNotification extends Component {
  componentDidMount() {
    const {
      notification: { status = 'success', title = '' },
    } = this.props;
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
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default DisplayNotification;
