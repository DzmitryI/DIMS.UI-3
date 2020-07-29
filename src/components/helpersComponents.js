import FetchService from '../services/fetchFirebase';
import DisplayNotification from './displayNotification';

const fetchService = new FetchService();
const notification = new DisplayNotification();

const getDate = (date) => {
  const [year, month, day] = date.split('-');
  return `${day.slice(0, 2)}.${month}.${year}`;
};

const getDateToComporation = (date) => {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
};

const getAllPointsForPeriod = ({ startDate, deadlineDate }, memberProgresses) => {
  const arrDatas = [];
  while (startDate.toISOString().slice(0, 10) <= deadlineDate.toISOString().slice(0, 10)) {
    const result = memberProgresses.filter(
      (memberProgress) => getDateToComporation(new Date(memberProgress.trackDate)) === getDateToComporation(startDate),
    );
    const points = {};
    if (result.length) {
      for (let value of result) {
        points[value.name] = +value.trackProgress;
      }
      arrDatas.push({
        name: `${startDate.getDate()}/${startDate.getMonth()}`,
        ...points,
      });
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  return arrDatas;
};

const countAge = (value) => {
  const curDate = new Date();
  const birthDate = new Date(value);
  const age = curDate.getFullYear() - birthDate.getFullYear();
  return curDate.setFullYear(curDate.getFullYear()) < birthDate.setFullYear(curDate.getFullYear()) ? age - 1 : age;
};

async function updateDataMemberProgress(userId = '', taskId = '') {
  let memberProgresses = [];
  const userTasks = await fetchService.getAllUserTasks();
  let curUserTasks = [];
  let result = '';
  if (userTasks.length) {
    if (userId) {
      result = userTasks.filter((userTask) => userTask.userId === userId);
    } else if (taskId) {
      result = userTasks.filter((userTask) => userTask.taskId === taskId);
    }
    if (result.length) {
      curUserTasks = curUserTasks.concat(...result);
    }
    if (curUserTasks.length) {
      const usersTaskTrack = await fetchService.getAllUserTaskTrack();
      if (usersTaskTrack.length) {
        for (const curUserTask of curUserTasks) {
          for (const userTaskTrack of usersTaskTrack) {
            if (curUserTask.userTaskId === userTaskTrack.userTaskId) {
              const response = await fetchService.getTask(curUserTask.taskId);
              memberProgresses = memberProgresses.concat({ userTaskTrack, task: response || [] });
            }
          }
        }
      }
    }
  }
  return memberProgresses;
}

async function updateDataMemberChart(userId = '', taskId = '') {
  let memberProgresses = [];
  let allMemberTasks = new Set();
  let arrDates = {
    startDate: new Date(),
    deadlineDate: new Date(),
  };
  const userTasks = await fetchService.getAllUserTasks();
  let curUserTasks = [];
  let result = '';
  if (userTasks.length) {
    if (userId) {
      result = userTasks.filter((userTask) => userTask.userId === userId);
    } else if (taskId) {
      result = userTasks.filter((userTask) => userTask.taskId === taskId);
    }
    if (result.length) {
      curUserTasks = curUserTasks.concat(...result);
    }
    if (curUserTasks.length) {
      const usersTaskTrack = await fetchService.getAllUserTaskTrack();
      if (usersTaskTrack.length) {
        for (const curUserTask of curUserTasks) {
          for (const userTaskTrack of usersTaskTrack) {
            if (curUserTask.userTaskId === userTaskTrack.userTaskId) {
              const [response] = await fetchService.getTask(curUserTask.taskId);
              memberProgresses.push({ ...userTaskTrack, ...response });
              allMemberTasks.add(response.name);
              if (new Date(response.startDate) < arrDates.startDate) {
                arrDates.startDate = new Date(response.startDate);
              }
              if (new Date(response.deadlineDate) > arrDates.deadlineDate) {
                arrDates.deadlineDate = new Date(response.deadlineDate);
              }
            }
          }
        }
      }
    }
  }
  for (let memberTask of allMemberTasks) {
    const curProrgress = memberProgresses.filter((curMemberProgress) => curMemberProgress.name === memberTask);
    curProrgress.sort(getSortUp('trackDate'));
    let startDate = new Date(curProrgress[0].trackDate);
    let { trackProgress, name } = curProrgress[0];
    const finishDate = new Date(curProrgress[curProrgress.length - 1].trackDate);
    while (startDate.toISOString().slice(0, 10) <= finishDate.toISOString().slice(0, 10)) {
      const res = curProrgress.filter((elem) => elem.trackDate.slice(0, 10) === startDate.toISOString().slice(0, 10));
      if (res.length) {
        trackProgress = res[0].trackProgress;
      } else {
        memberProgresses.push({ trackProgress: trackProgress, name: name, trackDate: startDate.toISOString() });
      }
      const nextDay = startDate.getDate() + 1;
      startDate.setDate(nextDay);
    }
  }
  return [memberProgresses, arrDates, Array.from(allMemberTasks)];
}

const updateDataMemberTasks = async (userId) => {
  let tasks = [];
  const userTasks = await fetchService.getAllUserTasks();
  if (userTasks.length) {
    for (const userTask of userTasks) {
      if (userTask.userId === userId) {
        const responseTasks = await fetchService.getTask(userTask.taskId);
        const responseTasksState = await fetchService.getTaskState(userTask.stateId);
        if (responseTasks.length && responseTasksState.data) {
          const { userTaskId, taskId, userId, stateId } = userTask;
          const [responseTask] = responseTasks;
          const { name, deadlineDate, startDate } = responseTask;
          const { stateName } = responseTasksState.data;
          tasks = tasks.concat({ userTaskId, taskId, userId, name, stateId, deadlineDate, startDate, stateName });
        }
      }
    }
  }
  return tasks;
};

async function deleteAllElements(id, element) {
  const resAllUserTasks = await fetchService.getAllUserTasks();
  if (resAllUserTasks.length) {
    const curUserTasks = resAllUserTasks.filter((resAllUserTask) => resAllUserTask[id] === element);
    if (curUserTasks.length) {
      for (const curUserTask of curUserTasks) {
        const responseUserTask = await fetchService.delUserTask(curUserTask.userTaskId);
        if (responseUserTask) {
          notification.notify('success', `User's task was deleted`);
        }
        const responseTaskState = await fetchService.delTaskState(curUserTask.stateId);
        if (responseTaskState) {
          notification.notify('success', `User's task state was deleted`);
        }
        const usersTaskTrack = await fetchService.getAllUserTaskTrack();
        if (usersTaskTrack.length) {
          for (const userTaskTrack of usersTaskTrack) {
            if (curUserTask.userTaskId === userTaskTrack.userTaskId) {
              const responseTaskTrackId = await fetchService.delTaskTrack(userTaskTrack.taskTrackId);
              if (responseTaskTrackId) {
                notification.notify('success', `Task track was deleted`);
              }
            }
          }
        }
      }
    }
  }
}

function getSortUp(param, param2 = null) {
  if (!param2) {
    return (a, b) => {
      if (a[param] > b[param]) {
        return 1;
      } else if (a[param] < b[param]) {
        return -1;
      } else {
        return 0;
      }
    };
  } else {
    return (a, b) => {
      if (a[param][param2] > b[param][param2]) {
        return 1;
      } else if (a[param][param2] < b[param][param2]) {
        return -1;
      } else {
        return 0;
      }
    };
  }
}

function getSortDown(param, param2 = null) {
  if (!param2) {
    return (a, b) => {
      if (a[param] > b[param]) {
        return -1;
      } else if (a[param] < b[param]) {
        return 1;
      } else {
        return 0;
      }
    };
  } else {
    return (a, b) => {
      if (a[param][param2] > b[param][param2]) {
        return -1;
      } else if (a[param][param2] < b[param][param2]) {
        return 1;
      } else {
        return 0;
      }
    };
  }
}

export {
  getDate,
  getDateToComporation,
  countAge,
  updateDataMemberProgress,
  updateDataMemberChart,
  updateDataMemberTasks,
  deleteAllElements,
  getSortUp,
  getSortDown,
  getAllPointsForPeriod,
};
