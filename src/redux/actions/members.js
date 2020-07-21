import FetchFirabase from '../../services/fetchFirebase';
import { deleteAllElements, getSortUp, getSortDown } from '../../components/helpersComponents';
import {
  FETCH_MEMBERS_START,
  FETCH_MEMBERS_SUCCESS,
  FETCH_MEMBERS_ERROR,
  FETCH_MEMBERS_DELETE_SUCCESS,
  FETCH_MEMBERS_DELETE_FINISH,
  FETCH_MEMBER_CHANGE_INDEX,
} from './actionTypes';

const fetchService = new FetchFirabase();

export function fetchMembers() {
  return async (dispatch) => {
    dispatch(fetchMembersStart());

    try {
      const members = await fetchService.getAllMember();
      const directions = await fetchService.getDirection();
      dispatch(fetchMembersSuccess(members, directions));
    } catch (error) {
      dispatch(fetchMembersError(error.message));
    }
  };
}

export function fetchMemberChangeIndex(memberId, member) {
  return async (dispatch) => {
    if (member) {
      try {
        await fetchService.editMember(memberId, member);
        dispatch(fetchMemberChangeIndexSuccess());
      } catch (error) {
        dispatch(fetchMembersError(error.message));
      }
    }
  };
}

export function fetchMembersDelete(memberId, members) {
  return async (dispatch) => {
    if (members) {
      const member = members.find((curMember) => curMember.userId === memberId);
      const { fullName } = member;
      await deleteAllElements('userId', memberId);
      try {
        await fetchService.delMember(memberId);
        dispatch(fetchMembersDeleteSuccess({ status: 'success', title: `${fullName} was deleted` }));
        dispatch(fetchMembersDeleteFinish());
      } catch (error) {
        dispatch(fetchMembersError(error.message));
      }
    }
  };
}

export function membersSort(members, directions, classList) {
  return (dispatch) => {
    dispatch(fetchMembersStart());
    const [, className] = classList;
    if (classList.value.includes('up')) {
      members.sort(getSortUp(className));
    } else {
      members.sort(getSortDown(className));
    }
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

export function fetchMemberChangeIndexSuccess() {
  return {
    type: FETCH_MEMBER_CHANGE_INDEX,
  };
}

export function fetchMembersError(errorMessage) {
  return {
    type: FETCH_MEMBERS_ERROR,
    errorMessage,
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
