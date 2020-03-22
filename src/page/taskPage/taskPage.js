import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';
import Button from '../../components/UI/button';
import Spinner from '../../components/spinner';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue, updateInput } from '../helpersPage';

const fetchService = new FetchService();
export default class TaskPage extends Component {
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
    members: [],
    userTasks: [],
  };

  taskState = {
    stateName: 'Active',
  };

  updateTaskMembers = async (taskId) => {
    const members = await fetchService.getAllMember();
    const userTasks = await fetchService.getAllUserTasks();
    if (userTasks.length) {
      userTasks.forEach((userTask) => {
        if (userTask.taskId === taskId) {
          const index = members.findIndex((member) => member.userId === userTask.userId);
          members[index].checked = true;
        }
      });
    }
    this.setState({ userTasks });
    return members;
  };

  checkTaskMembers = async (taskId) => {
    const { members, userTasks } = this.state;
    if (members.length) {
      for (const member of members) {
        const index = userTasks.findIndex(
          (userTask) => userTask.userId === member.userId && userTask.taskId === taskId,
        );
        if (index !== -1 && !member.checked) {
          const responseUserTask = await fetchService.delUserTask(userTasks[index].userTaskId);
          if (responseUserTask.statusText) {
            console.log(`del user task`);
          }
          const responseTaskState = await fetchService.delTaskState(userTasks[index].stateId);
          if (responseTaskState.statusText) {
            console.log(`del task state`);
          }
        } else if (index === -1 && member.checked) {
          const responseTaskState = await fetchService.setTaskState(this.taskState);
          if (responseTaskState.statusText) {
            console.log(`add task state`);
          }
          const responseUserTask = await fetchService.setUserTask({
            userId: member.userId,
            taskId,
            stateId: responseTaskState.data.name,
          });
          if (responseUserTask.statusText) {
            console.log(`add user task`);
          }
        }
      }
    }
    return members;
  };

  async componentDidMount() {
    const members = await fetchService.getAllMember();
    this.setState({ members, loading: false });
  }

  async componentDidUpdate(prevProps) {
    const { task } = this.props;
    if (task.length) {
      const [value] = task;
      const { taskId, ...values } = value;
      if (task !== prevProps.task) {
        const taskInput = updateInput(this.state.taskInput, values);
        const members = await this.updateTaskMembers(taskId);
        this.setState({ taskInput, taskId, isFormValid: true, task: values, members, loading: false });
      }
    }
  }

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
    const members = [...this.state.members];
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
    const addMembersTask = [];
    for (const member of members) {
      if (member.checked) {
        const response = await fetchService.setTaskState(this.taskState);
        if (response.statusText) {
          addMembersTask.push({ userId: member.userId, taskId, stateId: response.data.name });
        }
      }
    }
    return addMembersTask;
  };

  createTaskHandler = async () => {
    const { taskId, task, taskInput } = this.state;
    this.setState({ loading: false });
    if (!taskId) {
      const response = await fetchService.setTask(task);
      if (response.statusText) {
        alert(`add new task: ${task.name}`);
        this.setState({ taskId: response.data.name });
      }
      const addMembersTask = await this.createTaskState();
      if (addMembersTask.length) {
        for (const addMemberTask of addMembersTask) {
          const response = await fetchService.setUserTask(addMemberTask);
          if (response.statusText) {
            console.log(`add user task: ${task.name}`);
          }
        }
      }
    } else {
      const response = await fetchService.editTask(taskId, task);
      this.checkTaskMembers(taskId);
      if (response.statusText) {
        alert(`edit task: ${task.name}`);
      }
    }
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
      members: [],
    });
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
            onChange={this.onHandlelInput(controlName)}
          />
          {textArea}
        </React.Fragment>
      );
    });
  }

  renderCheckbox = () => {
    const members = [...this.state.members];
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
    } = this.state;
    return (
      <>
        <div className={isOpen ? `page-wrap` : `page-wrap close`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            <h1 className='subtitle'>{name}</h1>
            <div className='form-group'>{this.renderInputs()}</div>
            <div className='form-group'>
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <label htmlFor='members'>Members</label>
                  <div id='members' className='column'>
                    {this.renderCheckbox()}
                  </div>
                </>
              )}
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
