import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import { deleteAllElements, getDate, getSortUp, getSortDown } from '../helpersComponents';
import { headerTasksGrid, h1TaskPage, handleSortEnd } from '../helpersComponentPageMaking';
import { withTheme, withFetchService } from '../../hoc';
import Cell from '../UI/cell/Cell';
import Row from '../UI/row/Row';
import { statusThePageTask } from '../../redux/actions/statusThePage';

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
    const { onCreateTaskClick, statusThePageTask } = this.props;
    const { tasks } = this.state;
    onCreateTaskClick(tasks.length, h1TaskPage.get('Create'));
    statusThePageTask(true);
  };

  onChangeClick = ({ target }) => {
    const { onCreateTaskClick, statusThePageTask } = this.props;
    const taskId = target.closest('tr').id;
    const task = this.state.tasks.filter((curTask) => curTask.taskId === taskId);
    const [curTask] = task;
    if (target.id === 'edit') {
      onCreateTaskClick(curTask.index, h1TaskPage.get('Edit'), task);
    } else {
      onCreateTaskClick(curTask.index, h1TaskPage.get('Detail'), task);
    }
    statusThePageTask(true);
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
        setTimeout(() => this.setState({ onNotification: false, notification: {} }), 5000);
        this.fetchTasks();
      }
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  };

  handleSortClick = ({ target: { classList } }) => {
    const { tasks } = this.state;
    handleSortEnd();
    classList.toggle('active');
    const [, className] = classList;
    if (classList.value.includes('up')) {
      tasks.sort(getSortUp(className));
    } else {
      tasks.sort(getSortDown(className));
    }
    this.setState(tasks);
  };

  moveRow = async (dragIndex, hoverIndex) => {
    const { tasks } = this.state;
    const dragRow = tasks[dragIndex];
    dragRow.index = hoverIndex;
    const hoverRow = tasks[hoverIndex];
    hoverRow.index = dragIndex;
    try {
      await this.props.fetchService.editTask(dragRow.taskId, dragRow);
      await this.props.fetchService.editTask(hoverRow.taskId, hoverRow);
    } catch ({ message }) {
      this.setState({ error: true, errorMessage: message });
    }
    this.setState({ tasks });
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
        <Row
          key={task.taskId}
          id={taskId}
          index={index}
          moveRow={this.moveRow}
          value={
            <>
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
            </>
          }
        />
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
                <HeaderTable arr={headerTasksGrid} onClick={this.handleSortClick} />
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
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  theme: PropTypes.string.isRequired,
  onCreateTaskClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    statusThePageTask: (status) => dispatch(statusThePageTask(status)),
  };
};

export default connect(null, mapDispatchToProps)(withTheme(withFetchService(TasksGrid)));
