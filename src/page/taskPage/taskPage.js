import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';
import Button from '../../components/UI/button';

export default class TaskPage extends Component {
  fetchService = new FetchService();

  state = {
    isFormValid: false,
    taskInput: {
      name: {
        value: '',
        type: 'text',
        label: 'Task name',
        errorMessage: 'enter task name',
        valid: false,
        touched: false,
        validation: {
          required: true,
          name: true,
        },
      },
      startDate: {
        value: '',
        type: 'date',
        label: 'Start',
        errorMessage: 'Enter start date',
        valid: false,
        touched: false,
        validation: {
          required: true,
          startDate: true,
        },
      },
      deadlineDate: {
        value: '',
        type: 'date',
        label: 'Deadline',
        errorMessage: 'Enter deadline',
        valid: false,
        touched: false,
        validation: {
          required: true,
          deadline: true,
        },
      },
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
    if (task.length > 0) {
      const [value] = task;
      const { taskId, ...values } = value;

      if (task !== prevProps.task) {
        const taskInput = { ...this.state.taskInput };
        Object.entries(values).forEach(([key, val]) => {
          if (taskInput[key]) {
            taskInput[key].value = val;
            taskInput[key].touched = true;
            taskInput[key].valid = true;
          }
        });
        this.setState({ taskInput, taskId, isFormValid: true, task: values });
      }
    }
  }

  validateControl(value, validation) {
    if (!validation) {
      return true;
    }
    let isValid = true;
    if (validation.required) {
      isValid = value.trim() !== '';
    }
    return isValid;
  }

  buttonCloseClick = () => {
    const taskInput = { ...this.state.taskInput };
    const task = { ...this.state.task };
    Object.keys(taskInput).forEach((key) => {
      if (taskInput[key] !== undefined) {
        taskInput[key].value = '';
        taskInput[key].touched = false;
        taskInput[key].valid = false;
        task[key] = '';
      }
    });
    task['description'] = '';
    this.setState({ taskInput, taskId: null, isFormValid: false, task });
    this.props.onCreateTaskClick();
  };

  createTaskHandler = async () => {
    const { taskId, task } = this.state;
    let res = {};
    if (!taskId) {
      res = await this.fetchService.setTask(task);
    } else {
      res = await this.fetchService.editTask(taskId, task);
    }
    this.setState({ task: res, taskInput: {}, taskId: '' });
    this.props.onCreateTaskClick();
  };

  handleImput = ({ target: { value } }, controlName) => {
    const taskInput = { ...this.state.taskInput };
    const task = { ...this.state.task };
    taskInput[controlName].value = value;
    taskInput[controlName].touched = true;
    taskInput[controlName].valid = this.validateControl(value, taskInput[controlName].validation);
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
              // cols='54'
              value={description}
              rows='7'
              onChange={this.handleTextArea}
            ></textarea>
          </div>
        );
      }
      return (
        <React.Fragment key={index}>
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
        <div className={!isOpen ? `task-wrap close` : `task-wrap`}>
          <h1 className='title'>{title}</h1>
          <form className='task-form'>
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
