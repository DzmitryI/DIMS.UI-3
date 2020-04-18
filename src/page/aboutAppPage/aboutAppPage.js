import React from 'react';
import { withTheme } from '../../hoc';

const AboutAppPage = ({ theme }) => {
  return (
    <>
      <div className='grid-wrap'>
        <h3>Hi, dear friend!</h3>
        <p>
          We are glad to see you in the <b>'Dev Incubator Management System'</b> project or more briefly is <b>DIMS</b>!
          From this moment, you are a member of a great development team. Happy code!
        </p>
        <h3>What is the DIMS?</h3>
        <p>
          In the few words, it is a system for getting tasks and tracking time. There are several user roles in the
          DIMS:
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
            <tr>
              <th>Actions</th>
              <th>Admin</th>
              <th>Mentor</th>
              <th>Member</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Watch the <b>Member’s Manage Grid</b>
              </td>
              <td className='green'>+</td>
              <td className='green'>+</td>
              <td className='red'>-</td>
            </tr>
            <tr>
              <td>
                Add, edit, and delete a member on <b>Member’s Manage Grid</b>
              </td>
              <td className='green'>+</td>
              <td className='red'>-</td>
              <td className='red'>-</td>
            </tr>
            <tr>
              <td>
                Watch the <b>Member’s Progress grid</b>
              </td>
              <td className='green'>+</td>
              <td className='green'>+</td>
              <td className='red'>-</td>
            </tr>
            <tr>
              <td>
                Watch the <b>Tasks Manage Grid</b>
              </td>
              <td className='green'>+</td>
              <td className='green'>+</td>
              <td className='red'>-</td>
            </tr>
            <tr>
              <td>
                Add, edit, and delete a <b>New task</b>
              </td>
              <td className='green'>+</td>
              <td className='green'>+</td>
              <td className='red'>-</td>
            </tr>
            <tr>
              <td>
                Watch the <b>Member’s Task Manage grid</b>
              </td>
              <td className='green'>+</td>
              <td className='green'>+</td>
              <td className='green'>+</td>
            </tr>
            <tr>
              <td>
                Set the <b>Member task’s state</b> as Success or Fail
              </td>
              <td className='green'>+</td>
              <td className='green'>+</td>
              <td className='red'>-</td>
            </tr>
            <tr>
              <td>
                Watch the <b>Subtasks Manage Grid</b> of the current Task{' '}
              </td>
              <td className='red'>-</td>
              <td className='red'>-</td>
              <td className='green'>+</td>
            </tr>
            <tr>
              <td>
                Add, edit, and delete a <b>Subtasks</b> of the current Task
              </td>
              <td className='red'>-</td>
              <td className='red'>-</td>
              <td className='green'>+</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default withTheme(AboutAppPage);
