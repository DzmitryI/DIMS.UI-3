import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Button from '../../components/UI/button';
import Input from '../../components/UI/input';
import Backdrop from '../../components/UI/backdrop';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue } from '../helpersPage';

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
    taskTrack: {
      userTaskId: '',
      trackDate: '',
      trackNote: '',
    },
  };

  componentDidUpdate(prevProps) {
    if (this.props.userTaskId !== prevProps.userTaskId) {
      const { taskTrack } = this.state;
      taskTrack.userTaskId = this.props.userTaskId;
      this.setState({
        taskTrack,
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
    const { taskTrack, taskTrackInput, userId } = this.state;
    const res = clearOblectValue(taskTrackInput, taskTrack);
    this.setState({
      taskTrackInput: res.objInputClear,
      taskTrack: res.objElemClear,
      isFormValid: false,
      loading: true,
    });
    this.props.onTrackClick(userId);
  };

  createTaskTrackHandler = async () => {
    const { taskTrack, taskTrackInput } = this.state;
    const response = await fetchService.setTaskTrack(taskTrack);
    if (response.statusText) {
      alert(`add new task track`);
      this.setState({ taskId: response.data.name });
    }
    const res = clearOblectValue(taskTrackInput, taskTrack);
    this.setState({ taskTrackInput: res.objInputClear, taskTrack: res.objElemClear });
    this.props.onTrackClick();
  };

  renderInputs() {
    return Object.keys(this.state.taskTrackInput).map((controlName, index) => {
      const control = this.state.taskTrackInput[controlName];
      return (
        <Input
          key={controlName + index}
          id={controlName + index}
          type={control.type}
          value={control.value}
          valid={control.valid}
          touched={control.touched}
          label={control.label}
          errorMessage={control.errorMessage}
          shouldValidation={!!control.validation}
          onChange={this.onHandlelInput(controlName)}
        />
      );
    });
  }

  render() {
    const { isOpen, titleTask, titleTaskTrack } = this.props;
    const { taskTrack } = this.state;
    return (
      <>
        <div className={isOpen ? `page-wrap` : `page-wrap close`}>
          <h1 className='title'>{titleTaskTrack}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            <h1 className='subtitle'>{`Task Track - ${titleTask}`}</h1>
            {this.renderInputs()}
            <div className='form-group'>
              <label htmlFor='trackNote'>Note</label>
              <textarea
                id='trackNote'
                name='note'
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
                disabled={!this.state.isFormValid}
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
