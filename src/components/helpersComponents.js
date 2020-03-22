const headerTasksGrid = ['#', 'Name', 'Start', 'Deadline', ''];
const headerMembersGrid = ['#', 'Full Name', 'Direction', 'Education', 'Start', 'Age', ''];
const headerMemberTasksGrid = ['#', 'Name', 'Start', 'Deadline', 'Status', '', '(Available only for Admin)'];

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

export { headerTasksGrid, headerMembersGrid, headerMemberTasksGrid, h1TaskPage, h1MemberPage };
