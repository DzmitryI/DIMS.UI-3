import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import { headerMemberTasksGrid, h1TaskTrackPage, TABLE_ROLES, getDate } from '../helpersComponents';
import { withFetchService, withRole, withTheme } from '../../hoc';
import Cell from '../UI/cell/Cell';

const MemberTasksGrid = ({ userId, title, onTrackClick, onOpenTaskTracksClick, fetchService, theme, email }) => {
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onNotification, setOnNotification] = useState(true);
  const [notification, setNotification] = useState({});
  const { ADMIN, MENTOR } = TABLE_ROLES;

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

  const onOpenTaskTracksClickHandler = ({ target }) => {
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
      setNotification({ title: `Task state was edited` });
      setOnNotification(true);
      setNotification({});
      setOnNotification(false);
    }
  };

  const renderTBody = (userTasks) => {
    return userTasks.map((userTask, index) => {
      const { userTaskId, taskId, name, stateId, deadlineDate, startDate, stateName } = userTask;
      return (
        <tr key={userTaskId} id={userTaskId}>
          <Cell className='td index' value={index + 1} />
          <Cell
            id={taskId}
            value={
              <span onClick={onOpenTaskTracksClickHandler}>
                <Link to='/TaskTracksGrid'>{name}</Link>
              </span>
            }
          />
          <Cell value={getDate(startDate)} />
          <Cell value={getDate(deadlineDate)} />
          <Cell className={`td-${stateName}`} value={stateName} />
          <Cell
            id={name}
            value={
              <Button
                className='btn-progress'
                onClick={onTrackClickHandler}
                name='Track'
                disabled={email === ADMIN || email === MENTOR}
              />
            }
          />
          <Cell
            id={stateId}
            value={
              <>
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
              </>
            }
          />
        </tr>
      );
    });
  };

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
        <tbody>{renderTBody(userTasks)}</tbody>
      </table>
      {onNotification && <DisplayNotification notification={notification} />}
    </div>
  );
};

export default withTheme(withRole(withFetchService(MemberTasksGrid)));
