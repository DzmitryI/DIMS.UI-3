import FetchFirabase from '../../services/fetchFirebase';
import FetchAzure from '../../services/fetchAzure';
import { deleteAllElements } from '../../components/helpersComponents';
import {
  FETCH_MEMBERS_START,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_ERROR,
  FETCH_MEMBERS_DELETE_SUCCESS,
  FETCH_MEMBERS_DELETE_FINISH,
} from '../actions/actionTypes';
let fetchService = '';

export function fetchMembers() {
  return async (dispatch) => {
    dispatch(fetchMembersStart());
    if (localStorage.getItem('base') === 'firebase') {
      fetchService = new FetchFirabase();
    } else {
      fetchService = new FetchAzure();
    }
    try {
      const members = await fetchService.getAllMember();
      const directions = await fetchService.getDirection();

      dispatch(fetchMembersSuccess(members, directions));
    } catch (error) {
      dispatch(fetchMembersError());
    }
  };
}

export function fetchMembersDelete(memberId, members) {
  return async (dispatch) => {
    if (members) {
      const member = members.find((member) => member.userId === memberId);
      const { fullName } = member;
      await deleteAllElements('userId', memberId);
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

export function fetchMembersError() {
  return {
    type: FETCH_MEMBERS_ERROR,
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
