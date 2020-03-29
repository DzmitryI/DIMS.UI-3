import React, { Component } from 'react';
import Input from '../UI/input';
import Button from '../UI/button';
import axios from 'axios';
import DisplayNotification from '../../components/displayNotification';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue } from '../../page/helpersPage';

export default class Auth extends Component {
  state = {
    isFormValid: false,
    authInput: {
      email: createControl(
        {
          label: 'Email',
          errorMessage: 'enter correct email',
          type: 'email',
        },
        { required: true, email: true },
      ),
      password: createControl(
        {
          label: 'Password',
          errorMessage: 'enter password',
          type: 'password',
        },
        { required: true, minLenght: 6 },
      ),
    },
    authData: {
      email: '',
      password: '',
      returnSecureToken: true,
    },
  };

  API_Key = `AIzaSyDHq6aCzLnR-4gyK4nMaY2zHgfUSw_OrVI`;

  loginHanler = async () => {
    const { authData } = this.state;
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_SIGNIN}${this.API_Key}`, authData);
      const { data } = response;
      const expirationDate = new Date(new Date().getTime() + data.expiresIn * 1000);
      localStorage.setItem('token', data.idToken);
      localStorage.setItem('userId', data.localId);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('email', data.email);
      this.props.authSuccess(data.idToken, data.email);
      this.props.autoLogout(data.expiresIn);
      this.props.onloginHandler(response.data);
      DisplayNotification({ title: 'login successful' });
    } catch (err) {
      DisplayNotification({ title: err.message });
    }
  };

  registerHandler = async () => {
    const { authData, authInput } = this.state;
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_SIGNUP}${this.API_Key}`, authData);
      const res = clearOblectValue(authInput, authData);
      this.setState({
        authInput: res.objInputClear,
        authData: res.objElemClear,
      });
      DisplayNotification({ title: `Email ${response.data.email} was registred` });
    } catch (err) {
      DisplayNotification({ title: err.message });
    }
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  onHandlelInput = (controlName) => (event) => this.handleInput(event, controlName);
  handleInput = ({ target: { value } }, controlName) => {
    const authInput = { ...this.state.authInput };
    const authData = { ...this.state.authData };
    authInput[controlName].value = value;
    authInput[controlName].touched = true;
    authInput[controlName].valid = validateControl(value, authInput[controlName].validation);
    authData[controlName] = value;
    let isFormValid = true;
    Object.keys(authInput).forEach((name) => {
      isFormValid = authInput[name].valid && isFormValid;
    });
    this.setState({ authInput, authData, isFormValid });
  };

  renderInputs() {
    const { authInput } = this.state;
    return Object.keys(authInput).map((controlName, index) => {
      const control = authInput[controlName];
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
    return (
      <div className='auth'>
        <h1>Authorization</h1>
        <form onSubmit={this.submitHandler}>
          {this.renderInputs()}
          <div className='form-group row'>
            <Button
              className='btn btn-add'
              type='success'
              id='Login'
              name='Log in'
              disabled={!this.state.isFormValid}
              onClick={this.loginHanler}
            />
            <Button
              className='btn btn-add'
              type='submit'
              name='Register'
              disabled={!this.state.isFormValid}
              onClick={this.registerHandler}
            />
          </div>
        </form>
      </div>
    );
  }
}
