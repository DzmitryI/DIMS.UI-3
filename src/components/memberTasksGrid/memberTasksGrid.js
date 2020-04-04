import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import { headerMemberTasksGrid, h1TaskTrackPage } from '../helpersComponents';
import { Link } from 'react-router-dom';
import { tableRoles } from '../helpersComponents';
import { ThemeContext, RoleContext } from '../context';
import { ToastContainer } from 'react-toastify';

const fetchService = new FetchService();
const notification = new DisplayNotification();

class MemberTasksGrid extends Component {
  state = {
    userTasks: [],
    loading: true,
  };

  updateMemberTasks = async (userId) => {
    const tasks = [];
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
            tasks.push({ userTaskId, taskId, userId, name, stateId, deadlineDate, startDate, stateName });
          }
        }
      }
    }
    return tasks;
  };

  async componentDidMount() {
    const { userId } = this.props;
    const userTasks = await this.updateMemberTasks(userId);
    this.setState({ userTasks, loading: false });
  }

  async componentDidUpdate(prevProps) {
    const { userId } = this.props;
    if (userId !== prevProps.userId) {
      const userTasks = await this.updateMemberTasks(userId);
      this.setState({ userTasks, loading: false });
    }
  }

  onTrackClick = ({ target }) => {
    const userTaskId = target.closest('tr').id;
    const taskName = target.closest('td').id;
    this.props.onTrackClick(userTaskId, h1TaskTrackPage.get('Create'), taskName);
  };

  onOpenTaskTracksClick = async ({ target }) => {
    const taskId = target.closest('td').id;
    this.props.onOpenTaskTracksClick('', taskId);
  };

  onStateTaskClick = async ({ target }) => {
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
    if (response.statusText) {
      const { userTasks } = this.state;
      const index = userTasks.findIndex((userTask) => userTask.stateId === stateId);
      userTasks[index].stateName = taskState.stateName;
      this.setState(userTasks);
      notification.notify('success', `Task state was edited`);
    }
  };

  render() {
    const { title, email, theme } = this.props;
    const { userTasks, loading } = this.state;
    const admin = tableRoles.get('admin');
    const mentor = tableRoles.get('mentor');
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={`grid-wrap`}>
        {email === admin || email === mentor ? <Link to='/MembersGrid'>back to grid</Link> : null}
        <h1>Member's Tasks Manage Grid</h1>
        <table border='1' className={`${theme}--table`}>
          <caption>{title ? `Hi, dear ${title}! This is your current tasks:` : null}</caption>
          <thead>
            <HeaderTable arr={headerMemberTasksGrid} />
          </thead>
          <tbody>
            {userTasks.map((userTask, index) => {
              const { userTaskId, taskId, name, stateId, deadlineDate, startDate, stateName } = userTask;
              return (
                <tr key={userTaskId} id={userTaskId}>
                  <td className='td'>{index + 1}</td>
                  <td className='td' id={taskId}>
                    <span onClick={this.onOpenTaskTracksClick}>
                      <Link to='/TaskTracksGrid'>{name}</Link>
                    </span>
                  </td>
                  <td className='td'>{startDate}</td>
                  <td className='td'>{deadlineDate}</td>
                  <td className='td'>{stateName}</td>
                  <td className='td' id={name}>
                    <Button
                      className='btn btn-progress'
                      onClick={this.onTrackClick}
                      name='Track'
                      disabled={email === admin || email === mentor}
                    />
                  </td>
                  <td className='td' id={stateId}>
                    <Button
                      className='btn btn-success'
                      onClick={this.onStateTaskClick}
                      id='success'
                      name='Success'
                      disabled={!(email === admin || email === mentor)}
                    />
                    <Button
                      className='btn btn-fail'
                      onClick={this.onStateTaskClick}
                      id='fail'
                      name='Fail'
                      disabled={!(email === admin || email === mentor)}
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
      <RoleContext.Consumer>
        {(email) => <MemberTasksGrid {...props} theme={theme} email={email} />}
      </RoleContext.Consumer>
    )}
  </ThemeContext.Consumer>
);
