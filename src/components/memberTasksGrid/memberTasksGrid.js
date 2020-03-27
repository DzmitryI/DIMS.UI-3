import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import Spinner from '../spinner';
import { headerMemberTasksGrid, h1TaskTrackPage } from '../helpersComponents';
import { Link } from 'react-router-dom';

const fetchService = new FetchService();

export default class MemberTasksGrid extends Component {
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
          if (responseTasks && responseTasksState.data) {
            const { userTaskId, taskId, userId, stateId } = userTask;
            const [responseTask] = responseTasks;
            const { name, deadlineDate, startDate } = responseTask;
            const { stateName } = responseTasksState;
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
      console.log(`edit task state`);
      const { userTasks } = this.state;
      const index = userTasks.findIndex((userTask) => userTask.stateId === stateId);
      userTasks[index].stateName = taskState.stateName;
      this.setState(userTasks);
    }
  };

  render() {
    const { title } = this.props;
    const { userTasks, loading } = this.state;
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={`grid-wrap`}>
        <Link to='/MembersGrid'>back to grid</Link>
        <h1>Member's Tasks Manage Grid</h1>
        <table border='1'>
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
                  <td className='td'>
                    <span onClick={this.onChangeClick} id={taskId}>
                      {name}
                    </span>
                  </td>
                  <td className='td'>{startDate}</td>
                  <td className='td'>{deadlineDate}</td>
                  <td className='td'>{stateName}</td>
                  <td className='td' id={name}>
                    <Button className='btn btn-progress' onClick={this.onTrackClick} name='Track' />
                  </td>
                  <td className='td' id={stateId}>
                    <Button className='btn btn-success' onClick={this.onStateTaskClick} id='success' name='Success' />
                    <Button className='btn btn-fail' onClick={this.onStateTaskClick} id='fail' name='Fail' />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
