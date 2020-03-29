import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import Spinner from '../spinner';
import DisplayNotification from '../../components/displayNotification';
import { headerTasksGrid, h1TaskPage } from '../helpersComponents';

export default class TasksGrid extends Component {
  state = {
    tasks: [],
    loading: true,
  };
  fetchService = new FetchService();

  async componentDidMount() {
    const tasks = await this.fetchService.getAllTask();
    this.setState({
      tasks,
      loading: false,
    });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isTask !== prevProps.isTask) {
      const tasks = await this.fetchService.getAllTask();
      this.setState({
        tasks,
      });
    }
  }

  onCreateTaskClick = () => {
    this.props.onCreateTaskClick(h1TaskPage.get('Create'));
  };

  onChangeClick = ({ target }) => {
    const taskId = target.closest('tr').id;
    const task = this.state.tasks.filter((task) => task.taskId === taskId);
    if (target.id === 'edit') {
      this.props.onCreateTaskClick(h1TaskPage.get('Edit'), task);
    } else {
      this.props.onCreateTaskClick(h1TaskPage.get('Detail'), task);
    }
  };

  onDeleteClick = async ({ target }) => {
    const taskId = target.closest('tr').id;
    const [task] = this.state.tasks.filter((task) => task.taskId === taskId);
    const { name } = task;
    const response = await this.fetchService.delTask(taskId);
    if (response.statusText) {
      DisplayNotification({ title: `task: ${name} was deleted` });
    }
    const tasks = await this.fetchService.getAllTask();
    this.setState({ tasks });
  };

  render() {
    const { tasks, loading } = this.state;

    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={'grid-wrap'}>
        <h1>Tasks Manage Grid</h1>
        <Button className='btn btn-register' name='Create' onClick={this.onCreateTaskClick} />
        <table border='1'>
          <thead>
            <HeaderTable arr={headerTasksGrid} />
          </thead>
          <tbody>
            {tasks.map((task, index) => {
              const { taskId, name, startDate, deadlineDate } = task;
              return (
                <tr key={task.taskId} id={taskId}>
                  <td className='td'>{index + 1}</td>
                  <td className='td'>
                    <span onClick={this.onChangeClick}>{name}</span>
                  </td>
                  <td className='td'>{startDate}</td>
                  <td className='td'>{deadlineDate}</td>
                  <td className='td'>
                    <Button className='btn btn-edit' id='edit' name='Edit' onClick={this.onChangeClick} />
                    <Button className='btn btn-delete' name='Delete' onClick={this.onDeleteClick} />
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
