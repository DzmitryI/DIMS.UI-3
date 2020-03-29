import FetchService from '../services/fetch-service';
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

const tableRoles = new Map([
  ['admin', 'admin@mail.ru'],
  ['mentor', 'mentor@mail.ru'],
]);

async function updateMemberProgress(userId = '', taskId = '') {
  const fetchService = new FetchService();
  const memberProgresses = [];
  const userTasks = await fetchService.getAllUserTasks();
  const curUserTasks = [];
  if (userTasks.length) {
    if (userId) {
      curUserTasks.push(...userTasks.filter((userTask) => userTask.userId === userId));
    } else if (taskId) {
      curUserTasks.push(...userTasks.filter((userTask) => userTask.taskId === taskId));
    }
    if (curUserTasks.length) {
      const usersTaskTrack = await fetchService.getAllUserTaskTrack();
      if (usersTaskTrack.length) {
        for (const curUserTask of curUserTasks) {
          for (const userTaskTrack of usersTaskTrack) {
            if (curUserTask.userTaskId === userTaskTrack.userTaskId) {
              const response = await fetchService.getTask(curUserTask.taskId);
              let task = [];
              if (response) {
                task = response;
              }
              memberProgresses.push({ userTaskTrack, task });
            }
          }
        }
      }
    }
  }
  return memberProgresses;
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
  tableRoles,
  updateMemberProgress,
};
