import axios from 'axios';
import { AUTH_SUCCESS, AUTH_LOGOUT, AUTH_NOTIFICATION } from './actionTypes';

const API_Key = `AIzaSyDHq6aCzLnR-4gyK4nMaY2zHgfUSw_OrVI`;

export function auth(email, password, isLogin) {
  return async (dispatch) => {
    const authData = {
      email,
      password,
      returnSecureToken: true,
    };

    let url = `${process.env.REACT_APP_URL_SIGNUP}${API_Key}`;

    if (isLogin) {
      url = `${process.env.REACT_APP_URL_SIGNIN}${API_Key}`;
    }
    try {
      const { data } = await axios.post(url, authData);
      const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);
      localStorage.setItem('token', data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('email', data.email);
      dispatch(authSuccess(data.idToken, data.email));
      dispatch(autoLogout(data.expiresIn));
      dispatch(authNotification(true, { status: 'success', title: 'Email is correct' }));
    } catch (error) {
      dispatch(authNotification(true, { status: 'error', title: error.message }));
    }
    setTimeout(() => {
      dispatch(authNotification(false, {}));
    }, 1000);
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
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, email));
        dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
}

export function logout() {
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) {
      continue;
    }
    localStorage.removeItem(key);
  }
  return {
    type: AUTH_LOGOUT,
  };
}

export function authSuccess(token, email) {
  return {
    type: AUTH_SUCCESS,
    token,
    email,
  };
}

export function authNotification(onNotification, notification) {
  return {
    type: AUTH_NOTIFICATION,
    onNotification,
    notification,
  };
}
