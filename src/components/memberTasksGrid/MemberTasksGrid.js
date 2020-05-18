import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import { headerMemberTasksGrid, h1TaskTrackPage, TABLE_ROLES, getDate, updateMemberTasks } from '../helpersComponents';
import { withFetchService, withRole, withTheme } from '../../hoc';
import Cell from '../UI/cell/Cell';

const MemberTasksGrid = ({ userId, title, onTrackClick, onOpenTaskTracksClick, fetchService, theme, email }) => {
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onNotification, setOnNotification] = useState(false);
  const [notification, setNotification] = useState({});
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { ADMIN, MENTOR } = TABLE_ROLES;
  const role = email === ADMIN || email === MENTOR;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUserTasks(await updateMemberTasks(userId));
        setLoading(false);
        setOnNotification(false);
      } catch ({ message }) {
        setLoading(false);
        setError(true);
        setErrorMessage(message);
      }
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
    try {
      await fetchService.editTaskState(stateId, taskState);
      const index = userTasks.findIndex((userTask) => userTask.stateId === stateId);
      userTasks[index].stateName = taskState.stateName;
      setUserTasks(userTasks);
      setNotification({ title: `Task state was edited` });
      setOnNotification(true);
    } catch ({ message }) {
      setLoading(false);
      setError(true);
      setErrorMessage(message);
    }
    setTimeout(() => setOnNotification(false), 1000);
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
            value={<Button className='btn-progress' onClick={onTrackClickHandler} name='Track' disabled={role} />}
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
                  disabled={!role}
                />
                <Button className='btn-fail' onClick={onStateTaskClick} id='fail' name='Fail' disabled={!role} />
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
      {role && <Link to='/MembersGrid'>back to grid</Link>}
      <h1>Member's Tasks Manage Grid</h1>
      {error ? (
        <ErrorIndicator errorMessage={errorMessage} />
      ) : (
        <table border='1' className={`${theme}--table`}>
          <caption>{title && `Hi, dear ${title}! This is your current tasks:`}</caption>
          <thead>
            <HeaderTable arr={headerMemberTasksGrid} />
          </thead>
          <tbody>{renderTBody(userTasks)}</tbody>
        </table>
      )}
      {onNotification && <DisplayNotification notification={notification} />}
    </div>
  );
};

MemberTasksGrid.propTypes = {
  userId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onTrackClick: PropTypes.func.isRequired,
  onOpenTaskTracksClick: PropTypes.func.isRequired,
  fetchService: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default withTheme(withRole(withFetchService(MemberTasksGrid)));
