import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import Spinner from '../spinner';

export default class TasksGrid extends Component {
  state = {
    tasks: null,
    loading: true,
    headerTable: ['#', 'Name', 'Start', 'Deadline', ''],
    h1TaskPage: null,
  };

  fetchService = new FetchService();

  async componentDidMount() {
    const tasks = await this.fetchService.getAllTask();
    let h1TaskPage = new Map();
    h1TaskPage.set('Create', 'Create Task page');
    h1TaskPage.set('Edit', 'Edit Task page');
    h1TaskPage.set('Detail', 'Detail Task page');
    this.setState({ tasks, loading: false, h1TaskPage });
  }

  onChangeClick = ({ target }) => {
    const editTaskId = target.closest('tr').id;
    const curTask = this.state.tasks.filter((el) => el.taskId === editTaskId);
    const { h1TaskPage } = this.state;
    if (target.tagName === 'BUTTON') {
      this.props.onCreateTaskClick(h1TaskPage.get('Edit'), curTask);
    } else {
      this.props.onCreateTaskClick(h1TaskPage.get('Detail'), curTask);
    }
  };

  onDeleteClick = async ({ target }) => {
    const delTaskId = target.closest('tr').id;
    const curTask = this.state.tasks;
    const getData = this.fetchService.delTask;
    this.setState({ tasks: curTask.filter((el) => el.taskId !== delTaskId) });
    try {
      await getData(delTaskId);
    } catch (err) {
      alert(err);
    }
  };

  render() {
    const { headerTable, h1TaskPage, tasks, loading } = this.state;
    const { onCreateTaskClick, isOpen } = this.props;

    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={isOpen ? `tasks-wrap` : `tasks-wrap`}>
        <h1>Tasks Manage Grid</h1>
        <Button
          className='btn btn-register'
          name='Create'
          onClick={() => onCreateTaskClick(h1TaskPage.get('Create'))}
        />
        <table border='1'>
          <thead>
            <HeaderTable arr={headerTable} />
          </thead>
          <tbody>
            {tasks
              ? tasks.map((val, index) => {
                  return (
                    <tr key={val.taskId} id={val.taskId}>
                      <td className='td'>{index + 1}</td>
                      <td className='td'>
                        <span onClick={this.onChangeClick}>{val.name}</span>
                      </td>
                      <td className='td'>{val.startDate}</td>
                      <td className='td'>{val.deadlineDate}</td>
                      <td className='td'>
                        <Button className='btn btn-edit' name='Edit' onClick={this.onChangeClick} />
                        <Button className='btn btn-delete' name='Delete' onClick={this.onDeleteClick} />
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
    );
  }
}
