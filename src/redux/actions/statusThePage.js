import {
  STATUS_THE_PAGE_CHART,
  STATUS_THE_PAGE_MEMBER,
  STATUS_THE_PAGE_TASK,
  STATUS_THE_PAGE_TRACK,
} from './actionTypes';

export function statusThePageChart(isChartOpen = false) {
  return {
    type: STATUS_THE_PAGE_CHART,
    isChartOpen,
  };
}

export function statusThePageMember(isMemberPageOpen = false) {
  return {
    type: STATUS_THE_PAGE_MEMBER,
    isMemberPageOpen,
  };
}

export function statusThePageTask(isTaskPageOpen = false) {
  return {
    type: STATUS_THE_PAGE_TASK,
    isTaskPageOpen,
  };
}

export function statusThePageTrack(isTrackPageOpen = false) {
  return {
    type: STATUS_THE_PAGE_TRACK,
    isTrackPageOpen,
  };
}
