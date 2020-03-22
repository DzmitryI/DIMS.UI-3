import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import Spinner from '../spinner';
import { headerMemberTasksGrid } from '../helpersComponents';

const fetchService = new FetchService();

export default class MemberTasksGrid extends Component {
  state = {
    userTasks: [],
    loading: true,
  };

  updateMemberTasks = async (userId) => {
    const tasks = [];
    const userTasksId = await fetchService.getAllUserTasks();
    if (userTasksId.length) {
      for (const userTask of userTasksId) {
        if (userTask.userId === userId) {
          const responseTask = await fetchService.getTask(userTask.taskId);
          const responseTaskState = await fetchService.getTaskState(userTask.stateId);
          if (responseTask.data && responseTaskState.data) {
            const { userTaskId, taskId, userId, stateId } = userTask;
            const { name, deadlineDate, startDate } = responseTask.data;
            const { stateName } = responseTaskState.data;
            tasks.push({ userTaskId, taskId, userId, name, stateId, deadlineDate, startDate, stateName });
          }
        }
      }
    }
    return tasks;
  };

  async componentDidUpdate(prevProps) {
    const { userId } = this.props;
    if (userId !== prevProps.userId) {
      const userTasks = await this.updateMemberTasks(userId);
      this.setState({ userTasks, loading: false });
    }
  }

  onTrackClick = () => {
    console.log('Track click');
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
    const { isOpen, fullName } = this.props;
    const { userTasks, loading } = this.state;
    if (loading && isOpen) {
      return <Spinner />;
    }
    return (
      <div className={`grid-wrap ${isOpen ? '' : 'close'}`}>
        <h1>Member's Tasks Manage Grid</h1>
        <table border='1'>
          <caption>{`Hi, dear ${fullName}! This is your current tasks:`}</caption>
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
                  <td className='td'>
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
