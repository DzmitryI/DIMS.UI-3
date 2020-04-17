import FetchService from '../../services/fetch-service';
import FetchBackEnd from '../../services/fetch-back-end';
import { deleteAllElements } from '../../components/helpersComponents';
import {
  FETCH_MEMBERS_START,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_DELETE_SUCCESS,
  FETCH_MEMBERS_DELETE_FINISH,
} from '../actions/actionTypes';
const fetchService = new FetchService();
const fetchBackEnd = new FetchBackEnd();

export function fetchMembers() {
  return async (dispatch) => {
    dispatch(fetchMembersStart());
    const members = await fetchService.getAllMember();
    const directions = await fetchService.getDirection();
    const membersBackEnd = await fetchBackEnd.getAllMember();
    dispatch(fetchMembersSuccess(members, directions));
  };
}

export function fetchMembersDelete(memberId, members) {
  return async (dispatch) => {
    if (members) {
      const member = members.find((member) => member.userId === memberId);
      const { fullName } = member;
      deleteAllElements('userId', memberId);
      const response = await fetchService.delMember(memberId);
      if (response) {
        const notification = { status: 'success', title: `${fullName} was deleted` };
        dispatch(fetchMembersDeleteSuccess(notification));
        dispatch(fetchMembersDelete());
      }
    }
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

export function fetchMembersDeleteSuccess(notification) {
  return {
    type: FETCH_MEMBERS_DELETE_SUCCESS,
    notification,
  };
}

export function fetchMembersDeleteFinish() {
  return {
    type: FETCH_MEMBERS_DELETE_FINISH,
  };
}
