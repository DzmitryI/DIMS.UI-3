/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import Button from '../UI/button';
import { headerTaskTrackGrid, h1TaskTrackPage, updateMemberProgress, getDate, TABLE_ROLES } from '../helpersComponents';
import { withTheme, withRole, withFetchService } from '../../hoc';
import Cell from '../UI/cell/Cell';
import Row from '../UI/row/Row';

class TaskTracksGrid extends Component {
  state = {
    tracks: [],
    loading: true,
    onNotification: false,
    notification: {},
    error: false,
    errorMessage: '',
  };

  componentDidMount() {
    this.fetchMemberProgress();
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;
    if (isOpen !== prevProps.isOpen) {
      this.setState({ loading: true });
      this.fetchMemberProgress();
    }
  }

  onChangeClick = ({ target }) => {
    const { tracks } = this.state;
    const taskTrackId = target.closest('tr').id;
    const { userTaskTrack, task } = tracks.find((track) => track.userTaskTrack.taskTrackId === taskTrackId);
    const [{ name }] = task;
    if (target.id === 'edit') {
      this.props.onTrackClick(userTaskTrack.userTaskId, h1TaskTrackPage.get('Edit'), name, userTaskTrack);
    } else {
      this.props.onTrackClick(userTaskTrack.userTaskId, h1TaskTrackPage.get('Detail'), name, userTaskTrack);
    }
  };

  onDeleteClick = async ({ target }) => {
    const taskTrackId = target.closest('tr').id;
    try {
      await this.props.fetchService.delTaskTrack(taskTrackId);
      const notification = { title: 'Task track was deleted' };
      this.setState({ onNotification: true, notification });
      setTimeout(() => this.setState({ onNotification: false, notification: {} }), 5000);
      this.fetchMemberProgress();
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { tracks } = this.state;
    const dragRow = tracks[dragIndex];
    this.setState({
      tracks: update(tracks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      }),
    });
  };

  async fetchMemberProgress() {
    try {
      const { taskId } = this.props;
      const tracks = await updateMemberProgress('', taskId);
      this.setState({ tracks, loading: false });
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  }

  render() {
    const { tracks, loading, notification, onNotification, error, errorMessage } = this.state;
    const { theme, email } = this.props;
    const { isAdmin, isMentor } = TABLE_ROLES;
    const adminMentor = email === isAdmin || email === isMentor;

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
              <HeaderTable arr={headerTaskTrackGrid} />
            </thead>
            <tbody>
              {tracks.map((track, index) => {
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
                    moveRow={this.moveRow}
                    value={
                      <>
                        <Cell className='td index' value={index + 1} />
                        <Cell value={<span onClick={this.onChangeClick}>{name}</span>} />
                        <Cell value={trackNote} />
                        <Cell value={getDate(trackDate)} />
                        <Cell
                          value={
                            <>
                              <Button
                                className='btn-edit'
                                onClick={this.onChangeClick}
                                id='edit'
                                name='Edit'
                                disabled={adminMentor}
                              />
                              <Button
                                className='btn-delete'
                                onClick={this.onDeleteClick}
                                name='Delete'
                                disabled={adminMentor}
                              />
                            </>
                          }
                        />
                      </>
                    }
                  />
                );
              })}
            </tbody>
          </table>
        )}
        {onNotification && <DisplayNotification notification={notification} />}
      </div>
    );
  }
}

TaskTracksGrid.propTypes = {
  taskId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  theme: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onTrackClick: PropTypes.func.isRequired,
};

export default withFetchService(withRole(withTheme(TaskTracksGrid)));
