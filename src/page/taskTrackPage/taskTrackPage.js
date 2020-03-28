import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../../components/UI/button';
import Input from '../../components/UI/input';
import Backdrop from '../../components/UI/backdrop';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue, updateInput } from '../helpersPage';
import { h1TaskTrackPage } from '../../components/helpersComponents';

const fetchService = new FetchService();

export default class TaskTrackPage extends Component {
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
  };

  componentDidUpdate(prevProps) {
    const { track, title, taskId } = this.props;
    let disabled = false;
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
      });
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
    });
    this.props.onTrackClick(taskId);
  };

  createTaskTrackHandler = async () => {
    const { taskTrackId, taskTrack, taskTrackInput, taskId } = this.state;
    taskTrack.userTaskId = this.props.userTaskId;
    if (!taskTrackId) {
      const response = await fetchService.setTaskTrack(taskTrack);
      if (response.statusText) {
        alert(`add new task track: ${taskTrackId}`);
      }
    } else {
      const response = await fetchService.editTaskTrack(taskTrackId, taskTrack);
      if (response.statusText) {
        alert(`edit task track: ${taskTrackId}`);
      }
    }
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
    const { taskTrack, disabled, isFormValid } = this.state;
    return (
      <>
        <div className={isOpen ? `page-wrap` : `page-wrap close`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            <h1 className='subtitle'>{`Task Track - ${subtitle}`}</h1>
            {this.renderInputs()}
            <div className='form-group'>
              <label htmlFor='trackNote'>Note</label>
              <textarea
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
                className='btn btn-add'
                type='submit'
                name='Save'
                disabled={disabled || !isFormValid}
                onClick={this.createTaskTrackHandler}
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
