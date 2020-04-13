import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import { headerTasksGrid, h1TaskPage, deleteAllElements } from '../helpersComponents';
import { ThemeContext } from '../context';

const fetchService = new FetchService();

export default class TasksGrid extends Component {
  state = {
    tasks: [],
    loading: true,
    onNotification: false,
    notification: {},
  };

  async componentDidMount() {
    const tasks = await fetchService.getAllTask();
    this.setState({
      tasks,
      loading: false,
    });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) {
      const tasks = await fetchService.getAllTask();
      this.setState({
        tasks,
        loading: false,
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
    this.setState({
      loading: true,
    });
  };

  onDeleteClick = async ({ target }) => {
    const taskId = target.closest('tr').id;
    const { name } = this.state.tasks.find((task) => task.taskId === taskId);
    const response = await fetchService.delTask(taskId);
    deleteAllElements('taskId', taskId);
    if (response) {
      const notification = { status: 'success', title: `${name} was deleted!` };
      this.setState({ onNotification: true, notification });
      setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
      const tasks = await fetchService.getAllTask();
      this.setState({ tasks });
    }
  };

  render() {
    const { tasks, loading, onNotification, notification } = this.state;

    if (loading) {
      return <Spinner />;
    }
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div className={'grid-wrap'}>
            <h1>Tasks Manage Grid</h1>
            <Button className='btn-register' name='Create' onClick={this.onCreateTaskClick} />
            <table border='1' className={`${theme}--table`}>
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
                        <Button className='btn-edit' id='edit' name='Edit' onClick={this.onChangeClick} />
                        <Button className='btn-delete' name='Delete' onClick={this.onDeleteClick} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {onNotification && <DisplayNotification notification={notification} />}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
