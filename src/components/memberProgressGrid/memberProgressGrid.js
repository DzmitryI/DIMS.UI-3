import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Spinner from '../spinner';
import HeaderTable from '../UI/headerTable';
import { headerMemberProgressGrid, h1TaskPage } from '../helpersComponents';
import { Link } from 'react-router-dom';

const fetchService = new FetchService();

export default class MembersGrid extends Component {
  state = {
    memberProgresses: [],
    loading: true,
    title: '',
  };

  fetchService = new FetchService();

  updateMemberProgress = async (userId) => {
    const memberProgresses = [];
    const userTasks = await fetchService.getAllUserTasks();
    if (userTasks.length) {
      const curUserTasks = userTasks.filter((userTask) => userTask.userId === userId);
      if (curUserTasks.length) {
        const usersTaskTrack = await this.fetchService.getAllUserTaskTrack();
        if (usersTaskTrack.length) {
          for (const curUserTask of curUserTasks) {
            for (const userTaskTrack of usersTaskTrack) {
              if (curUserTask.userTaskId === userTaskTrack.userTaskId) {
                const response = await fetchService.getTask(curUserTask.taskId);
                let task = [];
                if (response) {
                  task = response;
                }
                memberProgresses.push({ userTaskTrack, task });
              }
            }
          }
        }
      }
    }
    return memberProgresses;
  };

  async componentDidMount() {
    const { userId, title } = this.props;
    const memberProgresses = await this.updateMemberProgress(userId);
    this.setState({ memberProgresses, loading: false, title });
  }

  async componentDidUpdate(prevProps) {
    const { userId, title } = this.props;
    if (userId !== prevProps.userId) {
      this.setState({
        loading: false,
        title,
      });
    }
  }

  onShowClick = ({ target }) => {
    const { memberProgresses } = this.state;
    const [result] = memberProgresses.filter(
      (memberProgress) => memberProgress.userTaskTrack.taskTrackId === target.id,
    );
    const { task } = result;
    this.props.onTaskClick(h1TaskPage.get('Detail'), task);
  };

  render() {
    const { memberProgresses, loading, title } = this.state;
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={`grid-wrap`}>
        <Link to='/MembersGrid'>back to grid</Link>
        <h1>Member Progress Grid</h1>
        <table border='1'>
          <caption>{title ? `${title}'s progress:` : null}</caption>
          <thead>
            <HeaderTable arr={headerMemberProgressGrid} />
          </thead>
          <tbody>
            {memberProgresses.map((memberProgress, index) => {
              const {
                userTaskTrack: { taskTrackId, trackDate, trackNote },
                task: [task],
              } = memberProgress;
              const { name } = task;
              return (
                <tr key={taskTrackId} id={taskTrackId}>
                  <td className='td'>{index + 1}</td>
                  <td className='td'>
                    <span onClick={this.onShowClick} id={taskTrackId}>
                      {name}
                    </span>
                  </td>
                  <td className='td'>{trackNote}</td>
                  <td className='td'>{trackDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
