import { AUTH_SUCCESS, AUTH_LOGOUT, AUTH_NOTIFICATION, AUTH_REGISTER } from '../actions/actionTypes';

const initialState = {
  token: null,
  email: null,
  isRegistred: false,
  onNotification: false,
  notification: {},
};

export default function authReducer(
  state = initialState,
  { type, token = null, email = null, onNotification, notification },
) {
  switch (type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        token,
        email,
      };
    case AUTH_REGISTER:
      return {
        ...state,
        token,
        email,
        isRegistred: true,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        token,
        email,
        isRegistred: false,
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
