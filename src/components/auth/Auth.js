/* eslint-disable react/no-access-state-in-setstate */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import { createControl, validateControl, fillControl, formValid } from '../../services/helpers';
import { auth } from '../../store/actions/auth';
import imgLogo from '../../assets/images/logo.png';
import ImageComponent from '../imageComponent/ImageComponent';
import { renderInputs } from '../../page/helpersPage';

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
          errorMessage: 'enter password, min lenght 6 simbols',
          type: 'password',
        },
        { required: true, minLenght: 6 },
      ),
    },
  };

  loginHandler = () => {
    const {
      authInput: { email, password },
    } = this.state;
    this.props.auth(email.value, password.value, true);
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  onHandlelInput = (controlName) => (event) => {
    this.handleInput(event, controlName);
  };

  handleInput = ({ target: { value } }, controlName) => {
    const authInput = { ...this.state.authInput };
    authInput[controlName].value = value;
    authInput[controlName].touched = true;
    this.setState({ authInput, isFormValid: formValid(authInput) });
  };

  onHandleFinishEditing = (controlName) => (event) => {
    this.handleFinishEditing(event, controlName);
  };

  handleFinishEditing = ({ target: { value } }, controlName) => {
    const authInput = { ...this.state.authInput };
    authInput[controlName].valid = validateControl(value, authInput[controlName].validation);
    this.setState({ authInput, isFormValid: formValid(authInput) });
  };

  onHandleFocus = (controlName) => () => {
    this.handleFocus(controlName);
  };

  handleFocus = (controlName) => {
    let authInput = { ...this.state.authInput };
    authInput = fillControl(authInput, controlName);
    this.setState({ authInput });
  };

  render() {
    const { notification, onNotification } = this.props;
    const { isFormValid, authInput, disabled } = this.state;
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className='auth'>
          <ImageComponent className='auth-img' src={imgLogo} alt='logo' />
          <form onSubmit={this.submitHandler}>
            {renderInputs(authInput, disabled, this.onHandlelInput, this.onHandleFinishEditing, this.onHandleFocus)}
            <br />
            <div className='form-group row'>
              <Button type='success' id='login' name='Log in' disabled={!isFormValid} onClick={this.loginHandler} />
              <span className='goRegister'>
                <Link to='/Registration'>registration</Link>
              </span>
            </div>
          </form>
        </div>
      </>
    );
  }
}

Auth.propTypes = {
  onNotification: PropTypes.bool.isRequired,
  notification: PropTypes.objectOf(PropTypes.string).isRequired,
  auth: PropTypes.func.isRequired,
};

const mapStateToProps = ({ authData: { onNotification, notification } }) => {
  return {
    onNotification,
    notification,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
