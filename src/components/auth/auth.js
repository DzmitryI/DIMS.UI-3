import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import DisplayNotification from '../displayNotification';
import Input from '../UI/input';
import Button from '../UI/button';
import { createControl, validateControl } from '../../services/helpers.js';
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
    base: 'firebase',
  };

  API_Key = `AIzaSyDHq6aCzLnR-4gyK4nMaY2zHgfUSw_OrVI`;

  loginHanler = () => {
    const {
      authInput: { email, password },
      base,
    } = this.state;
    this.props.auth(email.value, password.value, base, true);
  };

  registerHandler = () => {
    const {
      authInput: { email, password },
      base,
    } = this.state;
    this.props.auth(email.value, password.value, base, false);
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

  handleRadio = ({ target: { value } }) => {
    this.setState({ base: value });
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
    const { notification, onNotification } = this.props;
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className='auth'>
          <h1>Authorization</h1>
          <form onSubmit={this.submitHandler}>
            {this.renderInputs()}
            <fieldset className='base-wrap'>
              <legend>Use base</legend>
              <label>
                <input
                  type='radio'
                  className='btn-radio'
                  value='firebase'
                  name='base'
                  checked={this.state.base === 'firebase'}
                  onClick={this.handleRadio}
                />
                Firebase
              </label>
              <label>
                <input
                  type='radio'
                  className='btn-radio'
                  value='azure'
                  name='base'
                  checked={this.state.base !== 'firebase'}
                  onClick={this.handleRadio}
                />
                Azure
              </label>
            </fieldset>
            <div className='form-group row'>
              <Button
                className='btn-add'
                type='success'
                id='Login'
                name='Log in'
                disabled={!this.state.isFormValid}
                onClick={this.loginHanler}
              />
              <Button
                className='btn-add'
                type='submit'
                name='Register'
                disabled={!this.state.isFormValid}
                onClick={this.registerHandler}
              />
            </div>
          </form>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    onNotification: state.auth.onNotification,
    notification: state.auth.notification,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, base, isLogin) => dispatch(auth(email, password, base, isLogin)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
