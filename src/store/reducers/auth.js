import { AUTH_SUCCESS, AUTH_LOGOUT, AUTH_NOTIFICATION } from '../actions/actionTypes';

const initialState = {
  token: null,
  email: null,
  onNotification: false,
  notification: {},
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        email: action.email,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        email: null,
      };
    case AUTH_NOTIFICATION:
      return {
        ...state,
        onNotification: action.onNotification,
        notification: action.notification,
      };
    default:
      return state;
  }
}
