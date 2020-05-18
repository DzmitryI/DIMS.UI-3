import {
  FETCH_MEMBERS_START,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_ERROR,
  FETCH_MEMBERS_DELETE_SUCCESS,
  FETCH_MEMBERS_DELETE_FINISH,
} from '../actions/actionTypes';

const initialState = {
  members: [],
  directions: [],
  loading: false,
  onNotification: false,
  errorMessage: '',
  error: false,
  notification: {},
};

export default function membersReducer(
  state = initialState,
  { type, members, directions, notification, errorMessage },
) {
  switch (type) {
    case FETCH_MEMBERS_START:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case FETCH_MEMBERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        members,
        directions,
      };
    case FETCH_MEMBERS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage,
      };
    case FETCH_MEMBERS_DELETE_SUCCESS:
      return {
        ...state,
        onNotification: true,
        error: false,
        notification,
      };
    case FETCH_MEMBERS_DELETE_FINISH:
      return {
        ...state,
        onNotification: false,
        error: false,
        notification: {},
      };
    default:
      return state;
  }
}
