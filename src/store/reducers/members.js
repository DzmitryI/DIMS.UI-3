import { FETCH_MEMBERS_START, FETCH_MEMBERS_SUCCESS } from '../actions/actionTypes';

const initialState = {
  members: [],
  directions: [],
  loading: false,
};

export default function membersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MEMBERS_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MEMBERS_SUCCESS:
      return {
        ...state,
        loading: false,
        members: action.members,
        directions: action.directions,
      };
    default:
      return state;
  }
}
