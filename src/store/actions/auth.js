/* eslint-disable no-shadow */
import axios from 'axios';
import { AUTH_SUCCESS, AUTH_LOGOUT, AUTH_NOTIFICATION, AUTH_REGISTER } from './actionTypes';

export function auth(email, password, isLogin, database = 'firebase') {
  return async (dispatch) => {
    const authData = {
      email,
      password,
      database,
      returnSecureToken: true,
    };

    const url = `${isLogin ? process.env.REACT_APP_URL_SIGNIN : process.env.REACT_APP_URL_SIGNUP}${
      process.env.REACT_APP_API_KEY
    }`;

    try {
      const {
        data: { expiresIn, idToken, email },
      } = await axios.post(url, authData);

      if (isLogin) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        localStorage.setItem('token', idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('email', email);
        localStorage.setItem('database', database);
        dispatch(authSuccess(idToken, email, database));
        dispatch(autoLogout(expiresIn));
      } else {
        dispatch(authRegister());
        dispatch(authNotification({ status: 'success', title: '✔️ The registration was successful' }));
      }
    } catch (error) {
      dispatch(authNotification({ status: 'error', title: `❗️ ${error.message}` }));
    }
    setTimeout(() => {
      dispatch(authNotification({}, false));
    }, 5000);
  };
}

export function autoLogout(time) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, time * 1000);
  };
}

export function autoLogin() {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const database = localStorage.getItem('database');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, email, database));
        dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
}

export function logout() {
  for (const key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }
    localStorage.removeItem(key);
  }
  return {
    type: AUTH_LOGOUT,
  };
}

export function authSuccess(token, email, database) {
  return {
    type: AUTH_SUCCESS,
    token,
    email,
    database,
  };
}

export function authRegister() {
  return {
    type: AUTH_REGISTER,
  };
}

export function authNotification(notification, onNotification = true) {
  return {
    type: AUTH_NOTIFICATION,
    onNotification,
    notification,
  };
}
