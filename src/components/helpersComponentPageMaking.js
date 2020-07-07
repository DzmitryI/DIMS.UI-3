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

const headerTasksGrid = ['', 'Name', 'Start', 'Deadline', ''];
const headerTaskTrackGrid = ['', 'Task', 'Note', 'Date', ''];
const headerMembersGrid = ['', 'Full Name', 'Direction', 'Education', 'Start', 'Age', ''];
const headerMemberTasksGrid = ['', 'Name', 'Start', 'Deadline', 'Status', 'Track', 'Available only for Admin'];
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
  isAdmin: 'admin@mail.ru',
  isMentor: 'mentor@mail.ru',
};

SetUp.propTypes = {
  fetchServiceValue: PropTypes.oneOfType([PropTypes.object]).isRequired,
  roleValue: PropTypes.string.isRequired,
  themeValue: PropTypes.string.isRequired,
  component: PropTypes.objectOf(PropTypes.object).isRequired,
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
};
