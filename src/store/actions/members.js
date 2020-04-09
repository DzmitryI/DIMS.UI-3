import FetchService from '../../services/fetch-service';
import { FETCH_MEMBERS_START, FETCH_MEMBERS_SUCCESS } from '../actions/actionTypes';
const fetchService = new FetchService();

export function fetchMembers() {
  return async (dispatch) => {
    dispatch(fetchMembersStart());
    const members = await fetchService.getAllMember();
    const directions = await fetchService.getDirection();
    dispatch(fetchMembersSuccess(members, directions));
  };
}

export function fetchMembersStart() {
  return {
    type: FETCH_MEMBERS_START,
  };
}

export function fetchMembersSuccess(members, directions) {
  return {
    type: FETCH_MEMBERS_SUCCESS,
    members,
    directions,
  };
}
