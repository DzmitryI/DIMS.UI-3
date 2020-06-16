import { AUTH_LOGOUT, AUTH_SUCCESS, AUTH_NOTIFICATION } from './actionTypes';
import { config } from '../../services/helpers';
import firebase from 'firebase/app';
import 'firebase/auth';
firebase.initializeApp(config);

export function authOtherService(service) {
  return async (dispatch) => {
    let provider = '';
    if (service === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    } else if (service === 'github') {
      provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('repo');
    } else if (service === 'twitter') {
      provider = new firebase.auth.TwitterAuthProvider();
    }
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function ({ credential: { accessToken }, user: { email } }) {
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('email', email);
        dispatch(authSuccess(accessToken, email));
        dispatch(autoLogout(3600));
      })
      .catch(function (error) {
        dispatch(authNotification({ status: 'error', title: `❗️ ${error.message}` }));
      });
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

export function authSuccess(token, email) {
  return {
    type: AUTH_SUCCESS,
    token,
    email,
  };
}

export function authNotification(notification, onNotification = true) {
  return {
    type: AUTH_NOTIFICATION,
    onNotification,
    notification,
  };
}
