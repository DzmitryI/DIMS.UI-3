import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { createNotify } from '../../services/helpers';
import 'react-toastify/dist/ReactToastify.css';

export default class DisplayNotification extends Component {
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
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnVisibilityChange={false}
          draggable={true}
          pauseOnHover={false}
        />
      </div>
    );
  }
}
