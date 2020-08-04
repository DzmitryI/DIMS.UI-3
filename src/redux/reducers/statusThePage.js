import {
  STATUS_THE_PAGE_CHART,
  STATUS_THE_PAGE_MEMBER,
  STATUS_THE_PAGE_TASK,
  STATUS_THE_PAGE_TRACK,
} from '../actions/actionTypes';

const initialState = {
  isChartOpen: false,
  isMemberPageOpen: false,
  isTaskPageOpen: false,
  isTrackPageOpen: false,
};

export default function statusThePageReducer(
  state = initialState,
  { type, isChartOpen, isMemberPageOpen, isTaskPageOpen, isTrackPageOpen },
) {
  switch (type) {
    case STATUS_THE_PAGE_CHART:
      return {
        ...state,
        isChartOpen,
      };
    case STATUS_THE_PAGE_MEMBER:
      return {
        ...state,
        isMemberPageOpen,
      };
    case STATUS_THE_PAGE_TASK:
      return {
        ...state,
        isTaskPageOpen,
      };
    case STATUS_THE_PAGE_TRACK:
      return {
        ...state,
        isTrackPageOpen,
      };
    default:
      return state;
  }
}
