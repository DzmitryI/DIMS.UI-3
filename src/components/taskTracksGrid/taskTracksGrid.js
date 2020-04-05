import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import HeaderTable from '../UI/headerTable';
import Button from '../UI/button';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import { headerTaskTrackGrid, h1TaskTrackPage, updateMemberProgress } from '../helpersComponents';
import { Link } from 'react-router-dom';
import { TABLE_ROLES } from '../helpersComponents';
import { ThemeContext, RoleContext } from '../context';
import { ToastContainer } from 'react-toastify';

const fetchService = new FetchService();
const notification = new DisplayNotification();

class TaskTracsGrid extends Component {
  state = {
    tracks: [],
    loading: true,
    taskId: '',
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
    const responseTaskTrackId = await fetchService.delTaskTrack(taskTrackId);
    if (responseTaskTrackId.statusText) {
      notification.notify('success', `Task track was deleted`);
    }
    const tracks = await updateMemberProgress('', this.state.taskId);
    this.setState({ tracks, loading: false });
  };

  render() {
    const { tracks, loading } = this.state;
    const { email, theme } = this.props;
    const admin = TABLE_ROLES.ADMIN;
    const mentor = TABLE_ROLES.MENTOR;
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={`grid-wrap`}>
        <Link to='/MemberTasksGrid'>back to grid</Link>
        <h1>Task Tracks Manage Grid</h1>
        <table border='1' className={`${theme}--table`}>
          <caption>{`This is your task tracks`}</caption>
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
                  <td className='td'>{index + 1}</td>
                  <td className='td'>
                    <span onClick={this.onChangeClick}>{name}</span>
                  </td>
                  <td className='td'>{trackNote}</td>
                  <td className='td'>{trackDate}</td>
                  <td className='td'>
                    <Button
                      className='btn btn-edit'
                      onClick={this.onChangeClick}
                      id='edit'
                      name='Edit'
                      disabled={email === admin || email === mentor}
                    />
                    <Button
                      className='btn btn-delete'
                      onClick={this.onDeleteClick}
                      name='Delete'
                      disabled={email === admin || email === mentor}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ToastContainer />
      </div>
    );
  }
}

export default (props) => (
  <ThemeContext.Consumer>
    {(theme) => (
      <RoleContext.Consumer>{(email) => <TaskTracsGrid {...props} theme={theme} email={email} />}</RoleContext.Consumer>
    )}
  </ThemeContext.Consumer>
);
