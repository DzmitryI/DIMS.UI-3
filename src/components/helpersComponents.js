import React from 'react';
import FetchService from '../services/fetchFirebase';
import DisplayNotification from './displayNotification';
import { FetchServiceProvider, RoleContextProvider, ThemeContextProvider } from './context';

const fetchService = new FetchService();
const notification = new DisplayNotification();

const headerTasksGrid = ['', 'Name', 'Start', 'Deadline', ''];
const headerTaskTrackGrid = ['', 'Task', 'Note', 'Date', ''];
const headerMembersGrid = ['', 'Full Name', 'Direction', 'Education', 'Start', 'Age', ''];
const headerMemberTasksGrid = ['', 'Name', 'Start', 'Deadline', 'Status', '', '(Available only for Admin)'];
const headerMemberProgressGrid = ['', 'Task', 'Note', 'Date'];
const headerAboutPage = ['Actions', 'Admin', 'Mentor', 'Member'];

const h1TaskPage = new Map([
  ['Create', 'Create Task page'],
  ['Edit', 'Edit Task page'],
  ['Detail', 'Detail Task page'],
]);
const h1MemberPage = new Map([
  ['Create', 'Create Member page'],
  ['Edit', 'Edit Member page'],
  ['Detail', 'Detail Member page'],
]);
const h1TaskTrackPage = new Map([
  ['Create', 'Create Task Tracks page'],
  ['Edit', 'Edit Task Tracks page'],
  ['Detail', 'Detail Task Tracks page'],
]);

const TABLE_ROLES = {
  ADMIN: 'admin@mail.ru',
  MENTOR: 'mentor@mail.ru',
};

const getDate = (date) => {
  const [year, month, day] = date.split('-');
  return `${day.slice(0, 2)}.${month}.${year}`;
};

const SetUp = ({ fetchServiceValue, roleValue, ThemeValue, component }) => {
  return (
    <FetchServiceProvider value={fetchServiceValue}>
      <RoleContextProvider value={roleValue}>
        <ThemeContextProvider value={ThemeValue}>{component}</ThemeContextProvider>
      </RoleContextProvider>
    </FetchServiceProvider>
  );
};

async function updateMemberProgress(userId = '', taskId = '') {
  let memberProgresses = [];
  const userTasks = await fetchService.getAllUserTasks();
  let curUserTasks = [];
  let result = '';
  if (userTasks.length) {
    if (userId) {
      result = userTasks.find((userTask) => userTask.userId === userId);
    } else if (taskId) {
      result = userTasks.find((userTask) => userTask.taskId === taskId);
    }
    if (result) {
      curUserTasks = curUserTasks.concat(result);
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

const updateMemberTasks = async (userId) => {
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

export {
  headerTasksGrid,
  headerTaskTrackGrid,
  headerMembersGrid,
  headerMemberTasksGrid,
  headerMemberProgressGrid,
  headerAboutPage,
  h1TaskPage,
  h1MemberPage,
  h1TaskTrackPage,
  TABLE_ROLES,
  getDate,
  SetUp,
  updateMemberProgress,
  updateMemberTasks,
  deleteAllElements,
};
