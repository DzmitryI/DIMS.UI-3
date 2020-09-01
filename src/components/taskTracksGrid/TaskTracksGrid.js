import React, { useEffect, useCallback, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import Button from '../UI/button';
import { withTheme, withRole, withFetchService } from '../../hoc';
import { statusThePageTrack } from '../../redux/actions/statusThePage';
import Cell from '../UI/cell/Cell';
import Row from '../UI/row/Row';
import { updateDataMemberProgress, getDate, getSort } from '../helpersComponents';
import { headerTaskTrackGrid, h1TaskTrackPage, TABLE_ROLES, handleSortEnd } from '../helpersComponentPageMaking';
import reducer from './TaskTracksGridReducer';
import { ERROR, ERROR_MESSAGE, TRACKS, LOADING, NOTIFICATION, ON_NOTIFICATION } from '../../redux/actions/actionTypes';

function TaskTracksGrid({ onTrackClick, statusPageTrack, isTrackPageOpen, fetchService, taskId, theme, email }) {
  const [{ tracks, loading, onNotification, notification, error, errorMessage }, dispatch] = useReducer(reducer, {
    tracks: [],
    loading: true,
    onNotification: false,
    notification: {},
    error: false,
    errorMessage: '',
  });

  const { isAdmin, isMentor } = TABLE_ROLES;
  const adminMentor = email === isAdmin || email === isMentor;

  const fetchMemberProgress = useCallback(async () => {
    try {
      dispatch({ type: TRACKS, tracks: await updateDataMemberProgress('', taskId) });
      dispatch({ type: LOADING, loading: false });
    } catch ({ message }) {
      dispatch({ type: LOADING, loading: false });
      dispatch({ type: ERROR, error: true });
      dispatch({ type: ERROR_MESSAGE, errorMessage: message });
    }
  }, [taskId]);

  useEffect(() => {
    fetchMemberProgress();
  }, [fetchMemberProgress]);

  useEffect(() => {
    dispatch({ type: LOADING, loading: true });
    fetchMemberProgress();
  }, [isTrackPageOpen, fetchMemberProgress]);

  const onChangeClick = ({ target }) => {
    const taskTrackId = target.closest('tr').id;
    const { userTaskTrack, task } = tracks.find((track) => track.userTaskTrack.taskTrackId === taskTrackId);
    const [{ name }] = task;
    if (target.id === 'edit') {
      onTrackClick(userTaskTrack.index, userTaskTrack.userTaskId, h1TaskTrackPage.get('Edit'), name, userTaskTrack);
    } else {
      onTrackClick(userTaskTrack.index, userTaskTrack.userTaskId, h1TaskTrackPage.get('Detail'), name, userTaskTrack);
    }
    statusPageTrack(true);
  };

  const onDeleteClick = async ({ target }) => {
    const taskTrackId = target.closest('tr').id;
    try {
      await fetchService.delTaskTrack(taskTrackId);
      dispatch({ type: NOTIFICATION, notification: { title: 'Task track was deleted' } });
      dispatch({ type: ON_NOTIFICATION, onNotification: true });
      setTimeout(() => {
        dispatch({ type: ON_NOTIFICATION, onNotification: false });
        dispatch({ type: NOTIFICATION, notification: {} });
      }, 5000);
      await fetchMemberProgress();
    } catch ({ message }) {
      dispatch({ type: LOADING, loading: false });
      dispatch({ type: ERROR_MESSAGE, errorMessage: message });
    }
  };

  const handleSortClick = ({ target: { classList } }) => {
    const arrTracks = [...tracks];
    handleSortEnd();
    classList.toggle('active');
    const [, classNameParent] = classList;
    if (classList.value.includes('up')) {
      arrTracks.sort(getSort('up', 'userTaskTrack', classNameParent));
    } else {
      arrTracks.sort(getSort('down', 'userTaskTrack', classNameParent));
    }
    dispatch({ type: 'TRACKS', tracks: arrTracks });
  };

  const moveRow = async (dragIndex, hoverIndex) => {
    const arrTracks = [...tracks];
    const { userTaskTrack: dragRow } = arrTracks[dragIndex];
    dragRow.index = hoverIndex;
    const { userTaskTrack: hoverRow } = arrTracks[hoverIndex];
    hoverRow.index = dragIndex;
    try {
      await fetchService.editTaskTrack(dragRow.taskTrackId, dragRow);
      await fetchService.editTaskTrack(hoverRow.taskTrackId, hoverRow);
    } catch ({ message }) {
      dispatch({ type: ERROR, error: true });
      dispatch({ type: ERROR_MESSAGE, errorMessage: message });
    }
    arrTracks.sort(getSort('up', 'userTaskTrack', 'index'));
    dispatch({ type: 'TRACKS', tracks: arrTracks });
  };

  const renderTBody = (tracksArr) => {
    return tracksArr.map((track, index) => {
      const {
        userTaskTrack: { taskTrackId, trackDate, trackNote },
        task: [task],
      } = track;
      const { name } = task;
      return (
        <Row
          key={taskTrackId}
          id={taskTrackId}
          index={index}
          moveRow={moveRow}
          value={
            <>
              <Cell className='td index' value={index + 1} />
              <Cell value={<span onClick={onChangeClick}>{name}</span>} />
              <Cell value={trackNote} />
              <Cell value={getDate(trackDate)} />
              <Cell
                value={
                  <>
                    <Button className='btn-edit' onClick={onChangeClick} id='edit' name='Edit' disabled={adminMentor} />
                    <Button className='btn-delete' onClick={onDeleteClick} name='Delete' disabled={adminMentor} />
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
      <Link to='/MemberTasksGrid'>back to grid</Link>
      <h1>Task Tracks Manage Grid</h1>
      {error ? (
        <ErrorIndicator errorMessage={errorMessage} />
      ) : (
        <table border='1' className={`${theme}--table`}>
          <caption>This is your task tracks</caption>
          <thead>
            <HeaderTable arr={headerTaskTrackGrid} onClick={handleSortClick} />
          </thead>
          <tbody>{renderTBody(tracks)}</tbody>
        </table>
      )}
      {onNotification && <DisplayNotification notification={notification} />}
    </div>
  );
}

TaskTracksGrid.propTypes = {
  taskId: PropTypes.string.isRequired,
  isTrackPageOpen: PropTypes.bool.isRequired,
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  theme: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onTrackClick: PropTypes.func.isRequired,
  statusPageTrack: PropTypes.func.isRequired,
};

const mapStateToProps = ({ statusThePage: { isTrackPageOpen } }) => ({
  isTrackPageOpen,
});

const mapDispatchToProps = (dispatch) => {
  return {
    statusPageTrack: (status) => dispatch(statusThePageTrack(status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withFetchService(withRole(withTheme(TaskTracksGrid))));
