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
  notification: {},
};

export default function membersReducer(state = initialState, action) {
  switch (action.type) {
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
        members: action.members,
        directions: action.directions,
      };
    case FETCH_MEMBERS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case FETCH_MEMBERS_DELETE_SUCCESS:
      return {
        ...state,
        onNotification: true,
        notification: action.notification,
      };
    case FETCH_MEMBERS_DELETE_FINISH:
      return {
        ...state,
        onNotification: false,
        notification: {},
      };
    default:
      return state;
  }
}
