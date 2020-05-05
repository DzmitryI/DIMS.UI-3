import React, { Component } from 'react';
import Spinner from '../../components/spinner';
import DisplayNotification from '../../components/displayNotification';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';
import Button from '../../components/UI/button';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue, updateInput } from '../helpersPage';
import { h1TaskPage } from '../../components/helpersComponents';
import { withFetchService } from '../../hoc';
import PropTypes from 'prop-types';
import ErrorIndicator from '../../components/errorIndicator';

class TaskPage extends Component {
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
    loading: true,
    disabled: false,
    members: [],
    userTasks: [],
    onNotification: false,
    notification: {},
    error: false,
    errorMessage: '',
  };

  taskState = {
    stateName: 'Active',
  };

  updateTaskMembers = async (taskId) => {
    const { fetchService } = this.props;
    const members = await fetchService.getAllMember();
    const userTasks = await fetchService.getAllUserTasks();
    if (userTasks.length) {
      userTasks.forEach((userTask) => {
        if (userTask.taskId === taskId) {
          const index = members.findIndex((member) => member.userId === userTask.userId);
          if (index !== -1) {
            members[index].checked = true;
          }
        }
      });
    }
    this.setState({ userTasks });
    return members;
  };

  async componentDidUpdate(prevProps) {
    const { task, title, fetchService } = this.props;
    let disabled = false;
    if (title !== prevProps.title && title === h1TaskPage.get('Create')) {
      const members = await fetchService.getAllMember();
      this.setState({ members, loading: false });
    }
    if (task.length) {
      const [value] = task;
      const { taskId, ...values } = value;
      if (task !== prevProps.task) {
        const taskInput = updateInput(this.state.taskInput, values);
        try {
          const members = await this.updateTaskMembers(taskId);
          if (title === h1TaskPage.get('Detail')) {
            disabled = true;
          }
          this.setState({ taskInput, taskId, isFormValid: true, task: values, members, disabled, loading: false });
        } catch ({ message }) {
          this.setState({ loading: false, error: true, errorMessage: message });
        }
      }
    }
  }

  checkTaskMembers = async (taskId) => {
    const { members, userTasks, notification } = this.state;
    const { fetchService } = this.props;
    if (members.length) {
      for (const member of members) {
        const index = userTasks.findIndex(
          (userTask) => userTask.userId === member.userId && userTask.taskId === taskId,
        );
        if (index !== -1 && !member.checked) {
          const responseUserTask = await fetchService.delUserTask(userTasks[index].userTaskId);
          if (responseUserTask.statusText) {
            notification.status = 'success';
            notification.title = `User's task was deleted.`;
          }
          const responseTaskState = await fetchService.delTaskState(userTasks[index].stateId);
          if (responseTaskState.statusText) {
            notification.status = 'success';
            notification.title = `User's task state was deleted.`;
          }
        } else if (index === -1 && member.checked) {
          const responseTaskState = await fetchService.setTaskState(this.taskState);
          if (responseTaskState.statusText) {
            notification.status = 'success';
            notification.title = `User's task state was added.`;
          }
          const responseUserTask = await fetchService.setUserTask({
            userId: member.userId,
            taskId,
            stateId: responseTaskState.data.name,
          });
          if (responseUserTask.statusText) {
            notification.status = 'success';
            notification.title = `User's task was added.`;
          }
        }
        this.setState({ onNotification: true, notification });
        setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
      }
    }
    return members;
  };

  onHandlelInput = (controlName) => (event) => this.handleInput(event, controlName);
  handleInput = ({ target: { value } }, controlName) => {
    const { taskInput, task } = this.state;
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
    const { task } = this.state;
    task[id] = value;
    this.setState({ task });
  };

  handleCheckbox = ({ target }) => {
    const { members } = this.state;
    Object.values(members).forEach((member) => {
      if (member.userId === target.id) member.checked = target.checked;
    });
    this.setState({ members });
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  createTaskState = async () => {
    const { members, taskId } = this.state;
    let addMembersTask = [];
    for (const member of members) {
      if (member.checked) {
        const responseTaskState = await this.props.fetchService.setTaskState(this.taskState);
        if (responseTaskState.statusText) {
          addMembersTask = addMembersTask.concat({
            userId: member.userId,
            taskId,
            stateId: responseTaskState.data.name,
          });
        }
      }
    }
    return addMembersTask;
  };

  createTaskHandler = async () => {
    const { taskId, task, taskInput } = this.state;
    const { fetchService } = this.props;
    let notification = '';
    this.setState({ loading: false });
    if (!taskId) {
      const responseTask = await fetchService.setTask(task);
      if (responseTask.statusText) {
        notification = { title: `${task.name} was added.` };
        this.setState({ taskId: responseTask.data.name, notification });
      }
      const addMembersTask = await this.createTaskState();
      if (addMembersTask.length) {
        for (const addMemberTask of addMembersTask) {
          const responseUserTask = await fetchService.setUserTask(addMemberTask);
          if (responseUserTask.statusText) {
            notification = { title: `${task.name} was added for user.` };
          }
        }
      }
    } else {
      const responseTask = await fetchService.editTask(taskId, task);
      this.checkTaskMembers(taskId);
      if (responseTask.statusText) {
        notification = { title: `${task.name} was edited.` };
      }
    }
    this.setState({ onNotification: true, notification });
    setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
    const res = clearOblectValue(taskInput, task);
    this.setState({ taskInput: res.objInputClear, task: res.objElemClear, taskId: '', members: [] });
    this.props.onCreateTaskClick();
  };

  buttonCloseClick = () => {
    const { task, taskInput } = this.state;
    const res = clearOblectValue(taskInput, task);
    this.setState({
      taskInput: res.objInputClear,
      task: res.objElemClear,
      taskId: '',
      isFormValid: false,
      loading: true,
      disabled: false,
      members: [],
    });
    this.props.onCreateTaskClick();
  };

  renderInputs() {
    const {
      task: { description },
      disabled,
    } = this.state;
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
              disabled={disabled}
              onChange={this.handleTextArea}
            ></textarea>
          </div>
        );
      }
      return (
        <React.Fragment key={`form-group ${index}`}>
          <Input
            id={controlName + index}
            type={control.type}
            value={control.value}
            valid={control.valid}
            touched={control.touched}
            label={control.label}
            disabled={disabled}
            errorMessage={control.errorMessage}
            shouldValidation={!!control.validation}
            onChange={this.onHandlelInput(controlName)}
          />
          {textArea}
        </React.Fragment>
      );
    });
  }

  renderCheckbox = () => {
    const { members, disabled } = this.state;
    return members.map((member) => {
      return (
        <label key={member.userId}>
          <input
            type='checkbox'
            className='checkbox'
            id={member.userId}
            value={member.userId}
            onClick={this.handleCheckbox}
            defaultChecked={member.checked}
            disabled={disabled}
          />
          {member.fullName}
        </label>
      );
    });
  };

  render() {
    const { isOpen, title } = this.props;
    const {
      task: { name },
      loading,
      disabled,
      isFormValid,
      onNotification,
      notification,
      error,
      errorMessage,
    } = this.state;

    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className={`page-wrap ${isOpen ? '' : 'close'}`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            {loading ? (
              <Spinner />
            ) : (
              <>
                {error ? (
                  <ErrorIndicator errorMessage={errorMessage} />
                ) : (
                  <>
                    <h1 className='subtitle'>{name}</h1>
                    <div className='form-group'>{this.renderInputs()}</div>
                    <div className='form-group'>
                      <label htmlFor='members'>Members</label>
                      <div id='members' className='column'>
                        {this.renderCheckbox()}
                      </div>
                    </div>
                  </>
                )}
                <div className='form-group row'>
                  <Button
                    className='btn-add'
                    type='submit'
                    name='Save'
                    disabled={disabled || !isFormValid}
                    onClick={this.createTaskHandler}
                  />
                  <Button className='btn-close' name='Back to grid' onClick={this.buttonCloseClick} />
                </div>
              </>
            )}
          </form>
        </div>
        {isOpen && <Backdrop />}
      </>
    );
  }
}

TaskPage.propTypes = {
  task: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  fetchService: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default withFetchService(TaskPage);
