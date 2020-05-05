import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import Button from '../UI/button';
import { headerTaskTrackGrid, h1TaskTrackPage, updateMemberProgress, TABLE_ROLES } from '../helpersComponents';
import { withTheme, withRole, withFetchService } from '../../hoc';
import Cell from '../UI/cell/Cell';
import PropTypes from 'prop-types';

class TaskTracksGrid extends Component {
  state = {
    tracks: [],
    loading: true,
    taskId: '',
    onNotification: false,
    notification: {},
    error: false,
    errorMessage: '',
  };

  async fetchMemberProgress() {
    try {
      const { taskId } = this.props;
      const tracks = await updateMemberProgress('', taskId);
      this.setState({ tracks, taskId, loading: false });
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  }

  componentDidMount() {
    this.fetchMemberProgress();
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;
    if (isOpen !== prevProps.isOpen) {
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
      setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
      this.fetchMemberProgress();
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  };

  render() {
    const { tracks, loading, notification, onNotification, error, errorMessage } = this.state;
    const { theme, email } = this.props;
    const { ADMIN, MENTOR } = TABLE_ROLES;
    const admin_mentor = email === ADMIN || email === MENTOR;

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
                  <tr key={taskTrackId} id={taskTrackId}>
                    <Cell className='td index' value={index + 1} />
                    <Cell value={<span onClick={this.onChangeClick}>{name}</span>} />
                    <Cell value={trackNote} />
                    <Cell value={trackDate} />
                    <Cell
                      value={
                        <>
                          <Button
                            className='btn-edit'
                            onClick={this.onChangeClick}
                            id='edit'
                            name='Edit'
                            disabled={admin_mentor}
                          />
                          <Button
                            className='btn-delete'
                            onClick={this.onDeleteClick}
                            name='Delete'
                            disabled={admin_mentor}
                          />
                        </>
                      }
                    />
                  </tr>
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
  taskId: PropTypes.string,
  isOpen: PropTypes.bool,
  fetchService: PropTypes.object,
  theme: PropTypes.string,
  email: PropTypes.string,
};

export default withFetchService(withRole(withTheme(TaskTracksGrid)));
