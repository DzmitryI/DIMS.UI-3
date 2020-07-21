import React from 'react';
import PropTypes from 'prop-types';
import { FetchServiceProvider, RoleContextProvider, ThemeContextProvider } from './context';

const SetUp = ({ fetchServiceValue, roleValue, themeValue, component }) => {
  return (
    <FetchServiceProvider value={fetchServiceValue}>
      <RoleContextProvider value={roleValue}>
        <ThemeContextProvider value={themeValue}>{component}</ThemeContextProvider>
      </RoleContextProvider>
    </FetchServiceProvider>
  );
};

const headerTasksGrid = [
  { name: '', className: '' },
  { name: 'Name', className: 'name' },
  { name: 'Start', className: 'startDate' },
  { name: 'Deadline', className: 'deadlineDate' },
  { name: '', className: '' },
];
const headerTaskTrackGrid = [
  { name: '', className: '' },
  { name: 'Task', className: 'taskTrackId' },
  { name: 'Note', className: 'trackNote' },
  { name: 'Date', className: 'trackDate' },
  { name: '', className: '' },
];
const headerMembersGrid = [
  { name: '', className: '' },
  { name: 'Full Name', className: 'name' },
  { name: 'Direction', className: 'directionId' },
  { name: 'Education', className: 'education' },
  { name: 'Start', className: 'startDate' },
  { name: 'Age', className: 'birthDate' },
  { name: '', className: '' },
];

const headerMemberTasksGrid = [
  { name: '', className: '' },
  { name: 'Name', className: 'name' },
  { name: 'Start', className: 'startDate' },
  { name: 'Deadline', className: 'deadlineDate' },
  { name: 'Status', className: 'stateName' },
  { name: 'Track', className: '' },
  { name: 'Available only for Admin', className: '' },
];

const headerMemberProgressGrid = [
  { name: '', className: '' },
  { name: 'Task', className: 'userTaskTrack userTaskId' },
  { name: 'Note', className: 'userTaskTrack trackNote' },
  { name: 'Date', className: 'userTaskTrack trackDate' },
];

const headerAboutPage = [
  { name: 'Actions', className: '' },
  { name: 'Admin', className: '' },
  { name: 'Mentor', className: '' },
  { name: 'Member', className: '' },
];

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
  isAdmin: 'admin@mail.ru',
  isMentor: 'mentor@mail.ru',
};

SetUp.propTypes = {
  fetchServiceValue: PropTypes.oneOfType([PropTypes.object]).isRequired,
  roleValue: PropTypes.string.isRequired,
  themeValue: PropTypes.string.isRequired,
  component: PropTypes.objectOf(PropTypes.object).isRequired,
};

const handleSortEnd = (elem, className) => {
  [].forEach.call(elem, (col) => {
    col.classList.remove(className);
  });
};

export {
  SetUp,
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
  handleSortEnd,
};
