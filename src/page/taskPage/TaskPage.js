import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../components/spinner';
import DisplayNotification from '../../components/displayNotification';
import Backdrop from '../../components/UI/backdrop';
import Button from '../../components/UI/button';
import { createControl, validateControl, fillControl, formValid } from '../../services/helpers';
import { clearObjectValue, updateInput, renderInputs } from '../helpersPage';
import { h1TaskPage } from '../../components/helpersComponentPageMaking';
import { withFetchService } from '../../hoc';
import ErrorIndicator from '../../components/errorIndicator';
import DatePicker from '../../components/datePicker';
import { statusThePageTask } from '../../redux/actions/statusThePage';
import TextArea from '../../components/UI/textArea/TextArea';

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
    },
    task: {
      name: '',
      description: '',
      startDate: new Date(),
      deadlineDate: new Date(),
      index: '',
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

  static getDerivedStateFromProps(nextProps, prevState) {
    const { index } = nextProps;
    return {
      task: { ...prevState.task, index },
    };
  }

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

  updateTaskMembers = async (taskId) => {
    const {
      fetchService: { getAllMember, getAllUserTasks },
    } = this.props;
    const members = await getAllMember();
    const userTasks = await getAllUserTasks();
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
            notification.title = `✔️ User's task was deleted.`;
            this.setState({ onNotification: true, notification });
          }
          const responseTaskState = await fetchService.delTaskState(userTasks[index].stateId);
          if (responseTaskState.statusText) {
            notification.title = `✔️ User's task state was deleted.`;
            this.setState({ onNotification: true, notification });
          }
        } else if (index === -1 && member.checked) {
          const responseTaskState = await fetchService.setTaskState(this.taskState);
          if (responseTaskState.statusText) {
            notification.title = `✔️ User's task state was added.`;
            this.setState({ onNotification: true, notification });
          }
          const responseUserTask = await fetchService.setUserTask({
            userId: member.userId,
            taskId,
            stateId: responseTaskState.data.name,
          });
          if (responseUserTask.statusText) {
            notification.title = `✔️ User's task was added.`;
            this.setState({ onNotification: true, notification });
          }
        }
      }
    }
    return members;
  };

  onHandleInput = (controlName) => (event) => {
    this.handleInput(event, controlName);
  };

  handleInput = ({ target: { value } }, controlName) => {
    const { taskInput, task } = this.state;
    taskInput[controlName].value = value;
    taskInput[controlName].touched = true;
    task[controlName] = value;
    this.setState({ taskInput, task, isFormValid: formValid(taskInput) });
  };

  onHandleFinishEditing = (controlName) => (event) => {
    this.handleFinishEditing(event, controlName);
  };

  handleFinishEditing = ({ target: { value } }, controlName) => {
    const { taskInput } = this.state;
    taskInput[controlName].valid = validateControl(value, taskInput[controlName].validation);
    this.setState({ taskInput, isFormValid: formValid(taskInput) });
  };

  onHandleFocus = (controlName) => () => {
    this.handleFocus(controlName);
  };

  handleFocus = (controlName) => {
    let { taskInput } = this.state;
    taskInput = fillControl(taskInput, controlName);
    this.setState({ taskInput });
  };

  handleTextArea = ({ target: { id, value } }) => {
    const { task } = this.state;
    task[id] = value;
    this.setState({ task });
  };

  handleCheckbox = ({ target }) => {
    const { members } = this.state;
    Object.values(members).forEach((member) => {
      if (member.userId === target.id) {
        member.checked = target.checked;
      }
    });
    this.setState({ members });
  };

  onHandleChangeDate = (id) => (value) => {
    this.handleChangeDate(value, id);
  };

  handleChangeDate = (value, id) => {
    const { task } = this.state;
    task[id] = value;
    this.setState({ task });
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
    const {
      fetchService: { setTask, setUserTask, editTask },
      onCreateTaskClick,
      statusThePageTask,
    } = this.props;
    let notification = '';
    this.setState({ loading: false });
    try {
      if (!taskId) {
        const responseTask = await setTask(task);
        if (responseTask.statusText) {
          notification = { title: `✔️ ${task.name} was added.` };
          this.setState({ taskId: responseTask.data.name, notification, onNotification: true });
        }
        const addMembersTask = await this.createTaskState();
        if (addMembersTask.length) {
          for (const addMemberTask of addMembersTask) {
            const responseUserTask = await setUserTask(addMemberTask);
            if (responseUserTask.statusText) {
              notification = { title: `✔️ ${task.name} was added for user.` };
              this.setState({ onNotification: true, notification });
            }
          }
        }
      } else {
        const responseTask = await editTask(taskId, task);
        this.checkTaskMembers(taskId);
        if (responseTask.statusText) {
          notification = { title: `✔️ ${task.name} was edited.` };
          this.setState({ onNotification: true, notification });
        }
      }
    } catch ({ message }) {
      this.setState({ onNotification: true, notification: { title: `❗️ ${message}`, status: 'error' } });
    }
    setTimeout(() => this.setState({ onNotification: false, notification: {} }), 5000);
    const { objInputClear, objElemClear } = clearObjectValue(taskInput, task);
    this.setState({ taskInput: objInputClear, task: objElemClear, taskId: '', members: [] });
    onCreateTaskClick();
    statusThePageTask();
  };

  buttonCloseClick = () => {
    const { task, taskInput } = this.state;
    const { onCreateTaskClick, statusThePageTask } = this.props;
    const { objInputClear, objElemClear } = clearObjectValue(taskInput, task);
    this.setState({
      taskInput: objInputClear,
      task: objElemClear,
      taskId: '',
      isFormValid: false,
      loading: true,
      disabled: false,
      members: [],
    });
    onCreateTaskClick();
    statusThePageTask();
  };

  renderCheckbox = () => {
    const { members, disabled } = this.state;
    return members.map(({ userId, checked, fullName }) => {
      return (
        <label key={userId} htmlFor={userId}>
          <input
            type='checkbox'
            className='checkbox'
            id={userId}
            value={userId}
            onClick={this.handleCheckbox}
            defaultChecked={checked}
            disabled={disabled}
          />
          {fullName}
        </label>
      );
    });
  };

  render() {
    const { title, isTaskPageOpen } = this.props;
    const {
      task: { description, startDate, deadlineDate },
      loading,
      disabled,
      isFormValid,
      onNotification,
      notification,
      error,
      errorMessage,
      taskInput,
    } = this.state;
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className={`page-wrap ${isTaskPageOpen ? '' : 'close'}`}>
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
                    <div className='icon-close' onClick={this.buttonCloseClick}>
                      &#10006;
                    </div>
                    {renderInputs(
                      taskInput,
                      disabled,
                      this.onHandleInput,
                      this.onHandleFinishEditing,
                      this.onHandleFocus,
                    )}
                    <div className='row'>
                      <DatePicker
                        date={startDate}
                        id='startDate'
                        label='Start date'
                        disabled={disabled}
                        onChange={this.onHandleChangeDate('startDate')}
                      />
                      <DatePicker
                        date={deadlineDate}
                        id='deadlineDate'
                        label='Deadline'
                        disabled={disabled}
                        onChange={this.onHandleChangeDate('deadlineDate')}
                      />
                    </div>
                    <TextArea
                      value={description}
                      onChange={this.handleTextArea}
                      label='Description'
                      id='description'
                      name='description'
                    />
                    <div className='form-group'>
                      <label htmlFor='members'>Members</label>
                      <div id='members' className='column'>
                        {this.renderCheckbox()}
                      </div>
                    </div>
                  </>
                )}
                <div className='form-group row'>
                  {!disabled && (
                    <Button
                      className='btn-add'
                      type='submit'
                      name='Save'
                      disabled={disabled || !isFormValid}
                      onClick={this.createTaskHandler}
                    />
                  )}
                  <Button className='btn-close' name='Back to grid' onClick={this.buttonCloseClick} />
                </div>
              </>
            )}
          </form>
        </div>
        {isTaskPageOpen && <Backdrop className='backdrop-task' />}
      </>
    );
  }
}

TaskPage.propTypes = {
  isTaskPageOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  task: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))).isRequired,
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onCreateTaskClick: PropTypes.func.isRequired,
};

const mapStateToProps = ({ statusThePage: { isTaskPageOpen } }) => ({
  isTaskPageOpen,
});

const mapDispatchToProps = (dispatch) => {
  return {
    statusThePageTask: () => dispatch(statusThePageTask()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withFetchService(TaskPage));
