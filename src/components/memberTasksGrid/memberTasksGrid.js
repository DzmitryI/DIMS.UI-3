import React, { useState, useContext, useEffect } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import { headerMemberTasksGrid, h1TaskTrackPage } from '../helpersComponents';
import { Link } from 'react-router-dom';
import { TABLE_ROLES } from '../helpersComponents';
import { ThemeContext, RoleContext } from '../context';

const fetchService = new FetchService();

const MemberTasksGrid = ({ userId, title, onTrackClick, onOpenTaskTracksClick }) => {
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onNotification, setOnNotification] = useState(true);
  const [notification, setNotification] = useState({});

  const updateMemberTasks = async (userId) => {
    const tasks = [];
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
            tasks.push({ userTaskId, taskId, userId, name, stateId, deadlineDate, startDate, stateName });
          }
        }
      }
    }
    return tasks;
  };

  useEffect(() => {
    const fetchData = async () => {
      const userTasks = await updateMemberTasks(userId);
      setUserTasks(userTasks);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const onTrackClickHandler = ({ target }) => {
    const userTaskId = target.closest('tr').id;
    const taskName = target.closest('td').id;
    onTrackClick(userTaskId, h1TaskTrackPage.get('Create'), taskName);
  };

  const onOpenTaskTracksClickHandler = async ({ target }) => {
    const taskId = target.closest('td').id;
    onOpenTaskTracksClick('', taskId);
  };

  const onStateTaskClick = async ({ target }) => {
    const taskState = {
      stateName: 'Active',
    };
    const stateId = target.closest('td').id;
    if (target.id === 'success') {
      taskState.stateName = 'Success';
    } else {
      taskState.stateName = 'Fail';
    }
    const response = await fetchService.editTaskState(stateId, taskState);
    if (response) {
      const index = userTasks.findIndex((userTask) => userTask.stateId === stateId);
      userTasks[index].stateName = taskState.stateName;
      setUserTasks(userTasks);
      setNotification({ status: 'success', title: `Task state was edited` });
      setOnNotification(true);
      setNotification({});
      setOnNotification(false);
    }
  };

  const { ADMIN, MENTOR } = TABLE_ROLES;
  const { theme } = useContext(ThemeContext);
  const email = useContext(RoleContext);
  if (loading) {
    return <Spinner />;
  }
  return (
    <div className='grid-wrap'>
      {(email === ADMIN || email === MENTOR) && <Link to='/MembersGrid'>back to grid</Link>}
      <h1>Member's Tasks Manage Grid</h1>
      <table border='1' className={`${theme}--table`}>
        <caption>{title && `Hi, dear ${title}! This is your current tasks:`}</caption>
        <thead>
          <HeaderTable arr={headerMemberTasksGrid} />
        </thead>
        <tbody>
          {userTasks.map((userTask, index) => {
            const { userTaskId, taskId, name, stateId, deadlineDate, startDate, stateName } = userTask;
            return (
              <tr key={userTaskId} id={userTaskId}>
                <td className='td'>{index + 1}</td>
                <td className='td' id={taskId}>
                  <span onClick={onOpenTaskTracksClickHandler}>
                    <Link to='/TaskTracksGrid'>{name}</Link>
                  </span>
                </td>
                <td className='td'>{startDate}</td>
                <td className='td'>{deadlineDate}</td>
                <td className={`td-${stateName}`}>{stateName}</td>
                <td className='td' id={name}>
                  <Button
                    className='btn-progress'
                    onClick={onTrackClickHandler}
                    name='Track'
                    disabled={email === ADMIN || email === MENTOR}
                  />
                </td>
                <td className='td' id={stateId}>
                  <Button
                    className='btn-success'
                    onClick={onStateTaskClick}
                    id='success'
                    name='Success'
                    disabled={!(email === ADMIN || email === MENTOR)}
                  />
                  <Button
                    className='btn-fail'
                    onClick={onStateTaskClick}
                    id='fail'
                    name='Fail'
                    disabled={!(email === ADMIN || email === MENTOR)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {onNotification && <DisplayNotification notification={notification} />}
    </div>
  );
};

export default MemberTasksGrid;
