import { AUTH_SUCCESS, AUTH_LOGOUT, AUTH_NOTIFICATION, AUTH_REGISTER } from '../actions/actionTypes';

const initialState = {
  token: null,
  email: null,
  database: null,
  isRegistred: false,
  onNotification: false,
  notification: {},
};

export default function authReducer(
  state = initialState,
  { type, token, email, database, onNotification, notification },
) {
  switch (type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        token,
        email,
        database,
      };
    case AUTH_REGISTER:
      return {
        ...state,
        token: null,
        email: null,
        database: null,
        isRegistred: true,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        email: null,
        database: null,
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
