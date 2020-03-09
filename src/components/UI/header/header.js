import React from 'react';

const Header = () => {
  return (
    <div className='header'>
      <h3>
        <a href='#/'>DIMS</a>
      </h3>
      <ul className='main-menu'>
        <li>
          <a href='#/MemberGrid'>Members Grid</a>
        </li>
        <li>
          <a href='#/TasksGrid'>Tasks Grid</a>
        </li>
        <li>
          <a href='#/MembersTasksGrid'>Members Tasks Grid</a>
        </li>
      </ul>
    </div>
  );
};

export default Header;
