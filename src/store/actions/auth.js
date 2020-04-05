import axios from 'axios';
import DisplayNotification from '../../components/displayNotification';
import { AUTH_SUCCESS, AUTH_LOGOUT } from './actionTypes';

const API_Key = `AIzaSyDHq6aCzLnR-4gyK4nMaY2zHgfUSw_OrVI`;
const notification = new DisplayNotification();

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
      console.log(data);
      const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);
      localStorage.setItem('token', data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('email', data.email);
      notification.notify('success', `Email is correct`);
      dispatch(authSuccess(data.idToken));
      dispatch(autoLogout(data.expiresIn));
    } catch (error) {
      notification.notify('error', error.message);
    }
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
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
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

export function authSuccess(token) {
  return {
    type: AUTH_SUCCESS,
    token,
  };
}
