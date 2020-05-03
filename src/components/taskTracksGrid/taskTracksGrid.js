import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import HeaderTable from '../UI/headerTable';
import Button from '../UI/button';
import { headerTaskTrackGrid, h1TaskTrackPage, updateMemberProgress, TABLE_ROLES } from '../helpersComponents';
import { withTheme, withRole, withFetchService } from '../../hoc';
import Cell from '../UI/cell/Cell';

class TaskTracksGrid extends Component {
  state = {
    tracks: [],
    loading: true,
    taskId: '',
    onNotification: false,
    notification: {},
  };

  async componentDidMount() {
    const { taskId } = this.props;
    const tracks = await updateMemberProgress('', taskId);
    this.setState({ tracks, taskId, loading: false });
  }

  async componentDidUpdate(prevProps) {
    const { taskId, isOpen } = this.props;
    if (isOpen !== prevProps.isOpen) {
      const tracks = await updateMemberProgress('', taskId);
      this.setState({ tracks, loading: false });
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
    const responseTaskTrackId = await this.props.fetchService.delTaskTrack(taskTrackId);
    if (responseTaskTrackId) {
      const notification = { title: 'Task track was deleted' };
      this.setState({ onNotification: true, notification });
      setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
      const tracks = await updateMemberProgress('', this.state.taskId);
      this.setState({ tracks, loading: false });
    }
  };

  render() {
    const { tracks, loading, notification, onNotification } = this.state;
    const { ADMIN, MENTOR } = TABLE_ROLES;
    const { theme, email } = this.props;
    const admin_mentor = email === ADMIN || email === MENTOR;

    if (loading) {
      return <Spinner />;
    }

    return (
      <div className='grid-wrap'>
        <Link to='/MemberTasksGrid'>back to grid</Link>
        <h1>Task Tracks Manage Grid</h1>
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
        {onNotification && <DisplayNotification notification={notification} />}
      </div>
    );
  }
}

export default withFetchService(withRole(withTheme(TaskTracksGrid)));
