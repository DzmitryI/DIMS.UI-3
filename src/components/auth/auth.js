import React, { PureComponent } from 'react';
import Input from '../UI/input';
import Button from '../UI/button';
import { createControl, validateControl } from '../../services/helpers.js';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import { auth } from '../../store/actions/auth';

class Auth extends PureComponent {
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
  };

  API_Key = `AIzaSyDHq6aCzLnR-4gyK4nMaY2zHgfUSw_OrVI`;

  loginHanler = () => {
    this.props.auth(this.state.authInput.email.value, this.state.authInput.password.value, true);
  };

  registerHandler = () => {
    this.props.auth(this.state.authInput.email.value, this.state.authInput.password.value, false);
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  onHandlelInput = (controlName) => (event) => this.handleInput(event, controlName);
  handleInput = ({ target: { value } }, controlName) => {
    const authInput = { ...this.state.authInput };
    authInput[controlName].value = value;
    authInput[controlName].touched = true;
    authInput[controlName].valid = validateControl(value, authInput[controlName].validation);
    let isFormValid = true;
    Object.keys(authInput).forEach((name) => {
      isFormValid = authInput[name].valid && isFormValid;
    });
    this.setState({ authInput, isFormValid });
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
        <ToastContainer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin)),
  };
};
export default connect(null, mapDispatchToProps)(Auth);
