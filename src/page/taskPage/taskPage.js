import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';
import Button from '../../components/UI/button';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue } from '../helpersPage';

export default class TaskPage extends Component {
  fetchService = new FetchService();

  state = {
    isFormValid: false,
    taskInput: {
      name: createControl(
        {
          label: 'Task name',
          errorMessage: 'enter task name',
        },
        { required: true },
      ),
      startDate: createControl(
        {
          type: 'date',
          label: 'Start',
          errorMessage: 'Enter start date',
        },
        { required: true },
      ),
      deadlineDate: createControl(
        {
          type: 'date',
          label: 'Deadline',
          errorMessage: 'Enter deadline',
        },
        { required: true },
      ),
    },
    task: {
      name: '',
      description: '',
      startDate: '',
      deadlineDate: '',
    },
    taskId: null,
  };

  componentDidUpdate(prevProps) {
    const { task } = this.props;
    if (task.length) {
      const [value] = task;
      const { taskId, ...values } = value;
      if (task !== prevProps.task) {
        const taskInput = { ...this.state.taskInput };
        Object.entries(values).forEach(([key, value]) => {
          if (taskInput[key]) {
            taskInput[key].value = value;
            taskInput[key].touched = true;
            taskInput[key].valid = true;
          }
        });
        this.setState({ taskInput, taskId, isFormValid: true, task: values });
      }
    }
  }

  handleImput = ({ target: { value } }, controlName) => {
    const taskInput = { ...this.state.taskInput };
    const task = { ...this.state.task };
    taskInput[controlName].value = value;
    taskInput[controlName].touched = true;
    taskInput[controlName].valid = validateControl(value, taskInput[controlName].validation);
    task[controlName] = value;
    let isFormValid = true;
    Object.keys(taskInput).forEach((name) => {
      isFormValid = taskInput[name].valid && isFormValid;
    });
    this.setState({ taskInput, task, isFormValid });
  };

  handleTextArea = ({ target: { id, value } }) => {
    const task = { ...this.state.task };
    task[id] = value;
    this.setState({ task });
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  createTaskHandler = async () => {
    const { taskId, task, taskInput } = this.state;
    if (!taskId) {
      const response = await this.fetchService.setTask(task);
      if (response.statusText) {
        alert(`add new task: ${task.name}`);
      }
    } else {
      const response = await this.fetchService.editTask(taskId, task);
      if (response.statusText) {
        alert(`edit task: ${task.name}`);
      }
    }
    const res = clearOblectValue(taskInput, task);
    this.setState({ taskInput: res.objInputClear, task: res.objElemClear, taskId: '' });
    this.props.onCreateTaskClick();
  };

  buttonCloseClick = () => {
    const { task, taskInput } = this.state;
    const res = clearOblectValue(taskInput, task);
    this.setState({ taskInput: res.objInputClear, task: res.objElemClear, taskId: '', isFormValid: false });
    this.props.onCreateTaskClick();
  };

  renderInputs() {
    const { description } = this.state.task;
    return Object.keys(this.state.taskInput).map((controlName, index) => {
      const control = this.state.taskInput[controlName];
      let textArea = null;
      if (index === 0) {
        textArea = (
          <div className='form-group'>
            <label htmlFor='description'>Description</label>
            <textarea
              id='description'
              name='description'
              value={description}
              rows='7'
              onChange={this.handleTextArea}
            ></textarea>
          </div>
        );
      }
      return (
        <React.Fragment key={'form-group' + index}>
          <Input
            key={controlName + index}
            id={controlName}
            type={control.type}
            value={control.value}
            valid={control.valid}
            touched={control.touched}
            label={control.label}
            errorMessage={control.errorMessage}
            shouldValidation={!!control.validation}
            onChange={(event) => this.handleImput(event, controlName)}
          />
          {textArea}
        </React.Fragment>
      );
    });
  }

  render() {
    const { isOpen, title } = this.props;
    const { name } = this.state.task;
    return (
      <>
        <div className={!isOpen ? `page-wrap close` : `page-wrap`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            <h1 className='subtitle'>{name}</h1>
            <div className='form-group'>{this.renderInputs()}</div>
            <div className='form-group'>
              <label htmlFor='members'>Members</label>
              <div id='members' className='column'>
                <label>
                  <input type='checkbox' value='Авиамоторная' />
                  Авиамоторная
                </label>
                <label>
                  <input type='checkbox' value='Автозаводская' />
                  Автозаводская
                </label>
              </div>
            </div>
            <div className='form-group row'>
              <Button
                className='btn btn-add'
                type='submit'
                name='Save'
                disabled={!this.state.isFormValid}
                onClick={this.createTaskHandler}
              />
              <Button className='btn btn-close' name='Back to grid' onClick={this.buttonCloseClick} />
            </div>
          </form>
        </div>
        {isOpen && <Backdrop />}
      </>
    );
  }
}
