import { AUTH_SUCCESS, AUTH_LOGOUT, AUTH_NOTIFICATION } from '../actions/actionTypes';

const initialState = {
  token: null,
  email: null,
  base: null,
  onNotification: false,
  notification: {},
};

export default function authReducer(state = initialState, { type, token, email, base, onNotification, notification }) {
  switch (type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        token,
        email,
        base,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        email: null,
        base: null,
      };
    case AUTH_NOTIFICATION:
      return {
        ...state,
        onNotification,
        notification,
      };
    default:
      return state;
  }
}
