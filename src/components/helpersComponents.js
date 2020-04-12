import FetchService from '../services/fetch-service';
import DisplayNotification from './displayNotification';

const fetchService = new FetchService();
const notification = new DisplayNotification();

const headerTasksGrid = ['#', 'Name', 'Start', 'Deadline', ''];
const headerTaskTrackGrid = ['#', 'Task', 'Note', 'Date', ''];
const headerMembersGrid = ['#', 'Full Name', 'Direction', 'Education', 'Start', 'Age', ''];
const headerMemberTasksGrid = ['#', 'Name', 'Start', 'Deadline', 'Status', '', '(Available only for Admin)'];
const headerMemberProgressGrid = ['#', 'Task', 'Note', 'Date'];

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

async function updateMemberProgress(userId = '', taskId = '') {
  const memberProgresses = [];
  const userTasks = await fetchService.getAllUserTasks();
  const curUserTasks = [];
  if (userTasks.length) {
    if (userId) {
      curUserTasks.push(userTasks.find((userTask) => userTask.userId === userId));
    } else if (taskId) {
      curUserTasks.push(userTasks.find((userTask) => userTask.taskId === taskId));
    }
    if (curUserTasks.length) {
      const usersTaskTrack = await fetchService.getAllUserTaskTrack();
      if (usersTaskTrack.length) {
        for (const curUserTask of curUserTasks) {
          for (const userTaskTrack of usersTaskTrack) {
            if (curUserTask.userTaskId === userTaskTrack.userTaskId) {
              const response = await fetchService.getTask(curUserTask.taskId);
              memberProgresses.push({ userTaskTrack, task: response || [] });
            }
          }
        }
      }
    }
  }
  return memberProgresses;
}

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
  h1TaskPage,
  h1MemberPage,
  h1TaskTrackPage,
  TABLE_ROLES,
  updateMemberProgress,
  deleteAllElements,
};
