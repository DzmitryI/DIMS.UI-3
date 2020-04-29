import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { createNotify } from '../../services/helpers';
import 'react-toastify/dist/ReactToastify.css';

export default class DisplayNotification extends Component {
  componentDidMount() {
    const { status = 'success', title } = this.props.notification;
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