/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import { headerMemberTasksGrid, h1TaskTrackPage, TABLE_ROLES, getDate, updateMemberTasks } from '../helpersComponents';
import { withFetchService, withRole, withTheme } from '../../hoc';
import { statusThePageTrack } from '../../store/actions/statusThePage';
import Cell from '../UI/cell/Cell';
import Row from '../UI/row/Row';

const MemberTasksGrid = ({
  userId,
  title,
  onTrackClick,
  onOpenTaskTracksClick,
  fetchService,
  theme,
  email,
  statusThePageTrack,
}) => {
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onNotification, setOnNotification] = useState(false);
  const [notification, setNotification] = useState({});
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { isAdmin, isMentor } = TABLE_ROLES;
  const role = email === isAdmin || email === isMentor;

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
    statusThePageTrack(true);
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
    setTimeout(() => setOnNotification(false), 5000);
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRow = userTasks[dragIndex];
    setUserTasks(
      update(userTasks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      }),
    );
  };

  const renderTBody = (userTasks) => {
    return userTasks.map((userTask, index) => {
      const { userTaskId, taskId, name, stateId, deadlineDate, startDate, stateName } = userTask;
      return (
        <Row
          key={userTaskId}
          id={userTaskId}
          index={index}
          moveRow={moveRow}
          value={
            <>
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
                className={role ? 'td track' : 'td'}
                value={<Button className='btn-progress' onClick={onTrackClickHandler} name='Track' disabled={role} />}
              />
              <Cell
                id={stateId}
                className={!role ? 'td track' : 'td'}
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
            </>
          }
        />
      );
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='grid-wrap'>
      {role && <Link to='/MembersGrid'>back to grid</Link>}
      <h1>Member&apos;s Tasks Manage Grid</h1>
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
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  theme: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    statusThePageTrack: (status) => dispatch(statusThePageTrack(status)),
  };
};

export default connect(null, mapDispatchToProps)(withTheme(withRole(withFetchService(MemberTasksGrid))));
