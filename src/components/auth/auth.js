import React, { Component } from 'react';
import Input from '../UI/input';
import Button from '../UI/button';
import { validateControl } from '../../services/helpers.js';
import axios from 'axios';

export default class Auth extends Component {
  state = {
    isFormValid: false,
    authInput: {
      email: {
        value: '',
        type: 'email',
        label: 'Email',
        errorMessage: 'enter email',
        valid: false,
        touched: false,
        validation: {
          required: true,
          email: true,
        },
      },
      password: {
        value: '',
        type: 'password',
        label: 'Password',
        errorMessage: 'Enter password',
        valid: false,
        touched: false,
        validation: {
          required: true,
          minLenght: 6,
        },
      },
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
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  registerHandler = async () => {
    const { authData } = this.state;
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL_SIGNUP}${this.API_Key}`, authData);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  handleImput = ({ target: { value } }, controlName) => {
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
    return Object.keys(this.state.authInput).map((controlName, index) => {
      const control = this.state.authInput[controlName];
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
          onChange={(event) => this.handleImput(event, controlName)}
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
