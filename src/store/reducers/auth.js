import { AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/actionTypes';

const initialState = {
  token: null,
  email: null,
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
    default:
      return state;
  }
}
