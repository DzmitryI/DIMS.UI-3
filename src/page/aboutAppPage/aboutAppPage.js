import React from 'react';
import HeaderTable from '../../components/UI/headerTable';
import { withTheme } from '../../hoc';
import BodyTable from '../../components/UI/bodyTable/BodyTable';
import { headerAboutPage } from '../../components/helpersComponents';

const AboutAppPage = ({ theme }) => {
  const tableBody = [
    [
      {
        value: (
          <>
            Watch the <b>Member’s Manage Grid</b>
          </>
        ),
      },
      { class: 'green', value: '+' },
      { class: 'green', value: '+' },
      { class: 'red', value: '-' },
    ],
    [
      {
        value: (
          <>
            Add, edit, and delete a member on <b>Member’s Manage Grid</b>
          </>
        ),
      },
      { class: 'green', value: '+' },
      { class: 'red', value: '-' },
      { class: 'red', value: '-' },
    ],
    [
      {
        value: (
          <>
            Watch the <b>Member’s Progress grid</b>
          </>
        ),
      },
      { class: 'green', value: '+' },
      { class: 'green', value: '+' },
      { class: 'red', value: '-' },
    ],
    [
      {
        value: (
          <>
            Watch the <b>Tasks Manage Grid</b>
          </>
        ),
      },
      { class: 'green', value: '+' },
      { class: 'green', value: '+' },
      { class: 'red', value: '-' },
    ],
    [
      {
        value: (
          <>
            Add, edit, and delete a <b>New task</b>
          </>
        ),
      },
      { class: 'green', value: '+' },
      { class: 'green', value: '+' },
      { class: 'red', value: '-' },
    ],
    [
      {
        value: (
          <>
            Watch the <b>Member’s Task Manage grid</b>
          </>
        ),
      },
      { class: 'green', value: '+' },
      { class: 'green', value: '+' },
      { class: 'green', value: '+' },
    ],
    [
      {
        value: (
          <>
            Set the <b>Member task’s state</b> as Success or Fail
          </>
        ),
      },
      { class: 'green', value: '+' },
      { class: 'green', value: '+' },
      { class: 'red', value: '-' },
    ],
    [
      {
        value: (
          <>
            Watch the <b>Subtasks Manage Grid</b> of the current Task{' '}
          </>
        ),
      },
      { class: 'red', value: '-' },
      { class: 'red', value: '-' },
      { class: 'green', value: '+' },
    ],
    [
      {
        value: (
          <>
            {' '}
            Add, edit, and delete a <b>Subtasks</b> of the current Task
          </>
        ),
      },
      { class: 'red', value: '-' },
      { class: 'red', value: '-' },
      { class: 'green', value: '+' },
    ],
  ];
  return (
    <div className='grid-wrap'>
      <h3>Hi, dear friend!</h3>
      <p>
        We are glad to see you in the <b>'Dev Incubator Management System'</b> project or more briefly is <b>DIMS</b>!
        From this moment, you are a member of a great development team. Happy code!
      </p>
      <h3>What is the DIMS?</h3>
      <p>
        In the few words, it is a system for getting tasks and tracking time. There are several user roles in the DIMS:
      </p>
      <ul>
        <li>
          The first one is <b>Admin</b>.{' '}
        </li>
        <li>
          The second one is the <b>Mentor</b>.
        </li>
        <li>
          The lat one is the <b>Member</b>. It's just like you.
        </li>
      </ul>
      <h3>What can the roles do?</h3>
      <table border='1' className={`${theme}--table`}>
        <thead>
          <HeaderTable arr={headerAboutPage} />
        </thead>
        <tbody>
          <BodyTable arr={tableBody} />
        </tbody>
      </table>
    </div>
  );
};

export default withTheme(AboutAppPage);
