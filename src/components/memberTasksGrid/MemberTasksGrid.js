/* eslint-disable no-shadow */
import React, { useReducer, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import { getDate, updateDataMemberTasks, updateDataMemberProgress, getSort } from '../helpersComponents';
import { headerMemberTasksGrid, h1TaskTrackPage, TABLE_ROLES, handleSortEnd } from '../helpersComponentPageMaking';
import { withFetchService, withRole, withTheme } from '../../hoc';
import { statusThePageTrack } from '../../redux/actions/statusThePage';
import Cell from '../UI/cell/Cell';
import Row from '../UI/row/Row';
import reducer from './MemberTasksGridReducer';
import {
  ERROR,
  ERROR_MESSAGE,
  LOADING,
  NOTIFICATION,
  ON_NOTIFICATION,
  USER_TASKS,
} from '../../redux/actions/actionTypes';

const MemberTasksGrid = ({
  userId,
  title,
  onTrackClick,
  onOpenTaskTracksClick,
  fetchService,
  theme,
  email,
  statusPageTrack,
}) => {
  const { isAdmin, isMentor } = TABLE_ROLES;
  const role = email === isAdmin || email === isMentor;

  const [{ userTasks, loading, onNotification, notification, error, errorMessage }, dispatch] = useReducer(reducer, {
    userTasks: [],
    loading: true,
    notification: {},
    error: false,
    errorMessage: '',
  });

  const fetchData = useCallback(async () => {
    try {
      dispatch({ type: USER_TASKS, userTasks: await updateDataMemberTasks(userId) });
      dispatch({ type: LOADING, loading: false });
      dispatch({ type: ON_NOTIFICATION, onNotification: false });
    } catch ({ message }) {
      dispatch({ type: LOADING, loading: false });
      dispatch({ type: ERROR, error: true });
      dispatch({ type: ERROR_MESSAGE, errorMessage: message });
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onTrackClickHandler = async ({ target }) => {
    const userTaskId = target.closest('tr').id;
    const taskName = target.closest('td').id;
    const taskId = target.closest('tr').children[1].id;

    try {
      const tracks = await updateDataMemberProgress('', taskId);
      onTrackClick(tracks.length, userTaskId, h1TaskTrackPage.get('Create'), taskName);
    } catch ({ message }) {
      dispatch({ type: ERROR, error: true });
      dispatch({ type: ERROR_MESSAGE, errorMessage: message });
    }

    statusPageTrack(true);
  };

  const handleSortClick = ({ target: { classList } }) => {
    const userTasksArr = [...userTasks];
    handleSortEnd();
    classList.toggle('active');
    const [, className] = classList;
    if (classList.value.includes('up')) {
      userTasksArr.sort(getSort('up', className));
    } else {
      userTasksArr.sort(getSort('down', className));
    }
    dispatch({ type: USER_TASKS, userTasks: userTasksArr });
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
      dispatch({ type: USER_TASKS, userTasks });
      dispatch({ type: NOTIFICATION, notification: { title: `Task state was edited` } });
      dispatch({ type: ON_NOTIFICATION, onNotification: true });
    } catch ({ message }) {
      dispatch({ type: LOADING, loading: false });
      dispatch({ type: ERROR, error: true });
      dispatch({ type: ERROR_MESSAGE, errorMessage: message });
    }
    setTimeout(() => dispatch({ type: ON_NOTIFICATION, onNotification: false }), 5000);
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRow = userTasks[dragIndex];
    dispatch({
      type: USER_TASKS,
      userTasks: update(userTasks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      }),
    });
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
            <HeaderTable arr={headerMemberTasksGrid} onClick={handleSortClick} />
          </thead>
          <tbody>{renderTBody(userTasks)}</tbody>
        </table>
      )}
      {onNotification && <DisplayNotification notification={notification} />}
    </div>
  );
};

MemberTasksGrid.propTypes = {
  title: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  onTrackClick: PropTypes.func.isRequired,
  statusPageTrack: PropTypes.func.isRequired,
  onOpenTaskTracksClick: PropTypes.func.isRequired,
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    statusPageTrack: (status) => dispatch(statusThePageTrack(status)),
  };
};

export default connect(null, mapDispatchToProps)(withTheme(withRole(withFetchService(MemberTasksGrid))));
