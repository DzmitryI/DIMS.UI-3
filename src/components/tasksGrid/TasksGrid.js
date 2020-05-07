import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import { headerTasksGrid, h1TaskPage, deleteAllElements, getDate } from '../helpersComponents';
import { withTheme, withFetchService } from '../../hoc';
import Cell from '../UI/cell/Cell';

class TasksGrid extends Component {
  state = {
    tasks: [],
    loading: true,
    onNotification: false,
    notification: {},
    error: false,
    errorMessage: '',
  };

  componentDidMount() {
    this.fetchTasks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isTask !== prevProps.isTask) {
      this.fetchTasks();
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
    const { fetchService } = this.props;
    const taskId = target.closest('tr').id;
    const { name } = this.state.tasks.find((task) => task.taskId === taskId);
    try {
      const response = await fetchService.delTask(taskId);
      deleteAllElements('taskId', taskId);
      if (response) {
        const notification = { title: `${name} was deleted!` };
        this.setState({ onNotification: true, notification });
        setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
        this.fetchTasks();
      }
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  };

  async fetchTasks() {
    try {
      const tasks = await this.props.fetchService.getAllTask();
      this.setState({
        tasks,
        loading: false,
      });
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  }

  renderTBody = (tasks) => {
    return tasks.map((task, index) => {
      const { taskId, name, startDate, deadlineDate } = task;
      return (
        <tr key={task.taskId} id={taskId}>
          <Cell className='td index' value={index + 1} />
          <Cell value={<span onClick={this.onChangeClick}>{name}</span>} />
          <Cell value={getDate(startDate)} />
          <Cell value={getDate(deadlineDate)} />
          <Cell
            value={
              <>
                <Button className='btn-edit' id='edit' name='Edit' onClick={this.onChangeClick} />
                <Button className='btn-delete' name='Delete' onClick={this.onDeleteClick} />
              </>
            }
          />
        </tr>
      );
    });
  };

  render() {
    const { tasks, loading, onNotification, notification, error, errorMessage } = this.state;
    const { theme } = this.props;

    if (loading) {
      return <Spinner />;
    }

    return (
      <div className='grid-wrap'>
        <h1>Tasks Manage Grid</h1>
        {error ? (
          <ErrorIndicator errorMessage={errorMessage} />
        ) : (
          <>
            <Button className='btn-register' name='Create' onClick={this.onCreateTaskClick} />
            <table border='1' className={`${theme}--table`}>
              <thead>
                <HeaderTable arr={headerTasksGrid} />
              </thead>
              <tbody>{this.renderTBody(tasks)}</tbody>
            </table>
          </>
        )}
        {onNotification && <DisplayNotification notification={notification} />}
      </div>
    );
  }
}

TasksGrid.propTypes = {
  isTask: PropTypes.bool.isRequired,
  fetchService: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
};

export default withTheme(withFetchService(TasksGrid));
