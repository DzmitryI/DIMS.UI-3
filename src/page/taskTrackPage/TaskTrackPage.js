import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DisplayNotification from '../../components/displayNotification';
import Button from '../../components/UI/button';
import Input from '../../components/UI/input';
import Backdrop from '../../components/UI/backdrop';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue, updateInput } from '../helpersPage';
import { h1TaskTrackPage } from '../../components/helpersComponents';
import { withFetchService } from '../../hoc';
import Spinner from '../../components/spinner';

class TaskTrackPage extends Component {
  state = {
    isFormValid: false,
    taskTrackInput: {
      trackDate: createControl(
        {
          type: 'date',
          label: 'Date',
          errorMessage: 'Enter date',
        },
        { required: true },
      ),
    },
    taskTrack: {},
    disabled: false,
    taskTrackId: null,
    taskId: '',
    onNotification: false,
    notification: {},
    loading: true,
  };

  componentDidUpdate(prevProps) {
    const { track, title, taskId } = this.props;
    let disabled = false;
    if (title !== prevProps.title && title === h1TaskTrackPage.get('Create')) {
      this.setState({ loading: false });
    }
    if (Object.keys(track).length !== 0) {
      if (track !== prevProps.track) {
        const taskTrackInput = updateInput(this.state.taskTrackInput, track);
        const { taskTrackId, ...taskTrack } = track;
        if (title === h1TaskTrackPage.get('Detail')) {
          disabled = true;
        }
        this.setState({
          disabled,
          taskTrack,
          taskTrackId,
          isFormValid: true,
          taskTrackInput,
          taskId,
          loading: false,
        });
      }
    }
  }

  onHandlelInput = (controlName) => (event) => this.handleInput(event, controlName);
  handleInput = ({ target: { value } }, controlName) => {
    const { taskTrackInput, taskTrack } = this.state;
    taskTrackInput[controlName].value = value;
    taskTrackInput[controlName].touched = true;
    taskTrackInput[controlName].valid = validateControl(value, taskTrackInput[controlName].validation);
    taskTrack[controlName] = value;
    let isFormValid = true;
    Object.keys(taskTrackInput).forEach((name) => {
      isFormValid = taskTrackInput[name].valid && isFormValid;
    });
    this.setState({ taskTrackInput, taskTrack, isFormValid });
  };

  handleTextArea = ({ target: { id, value } }) => {
    const { taskTrack } = this.state;
    taskTrack[id] = value;
    this.setState({ taskTrack });
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  buttonCloseClick = () => {
    const { taskTrack, taskTrackInput, taskId } = this.state;
    const res = clearOblectValue(taskTrackInput, taskTrack);
    this.setState({
      taskTrackInput: res.objInputClear,
      taskTrack: res.objElemClear,
      isFormValid: false,
      disabled: false,
      loading: true,
    });
    this.props.onTrackClick(taskId);
  };

  createTaskTrackHandler = async () => {
    const { taskTrackId, taskTrack, taskTrackInput, taskId } = this.state;
    const { fetchService, userTaskId } = this.props;
    taskTrack.userTaskId = userTaskId;
    let notification = '';
    if (!taskTrackId) {
      const response = await fetchService.setTaskTrack(taskTrack);
      if (response) {
        notification = { title: `Add new task track.` };
      }
    } else {
      const response = await fetchService.editTaskTrack(taskTrackId, taskTrack);
      if (response) {
        notification = { title: `Task track was edited.` };
      }
    }
    this.setState({ onNotification: true, notification });
    setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
    const res = clearOblectValue(taskTrackInput, taskTrack);
    this.setState({ taskTrackInput: res.objInputClear, taskTrack: res.objElemClear });
    this.props.onTrackClick(taskId);
  };

  renderInputs() {
    const { taskTrackInput, disabled } = this.state;
    return Object.keys(taskTrackInput).map((controlName, index) => {
      const control = taskTrackInput[controlName];
      return (
        <Input
          key={controlName + index}
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
      );
    });
  }

  render() {
    const { isOpen, title, subtitle } = this.props;
    const { taskTrack, disabled, isFormValid, notification, onNotification, loading } = this.state;
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
                <h1 className='subtitle'>{`Task Track - ${subtitle}`}</h1>
                {this.renderInputs()}
                <div className='form-group'>
                  <label htmlFor='trackNote'>Note</label>
                  <textarea
                    key='trackNote'
                    id='trackNote'
                    name='note'
                    disabled={disabled}
                    value={taskTrack.trackNote}
                    rows='7'
                    onChange={this.handleTextArea}
                  ></textarea>
                </div>
                <div className='form-group row'>
                  <Button
                    className='btn-add'
                    type='submit'
                    name='Save'
                    disabled={disabled || !isFormValid}
                    onClick={this.createTaskTrackHandler}
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

TaskTrackPage.propTypes = {
  title: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  userTaskId: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  fetchService: PropTypes.object.isRequired,
  track: PropTypes.object.isRequired,
};

export default withFetchService(TaskTrackPage);
