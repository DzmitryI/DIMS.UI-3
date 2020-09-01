/* eslint-disable react/no-access-state-in-setstate */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import { createControl, validateControl, fillControl, formValid } from '../../services/helpers';
import { auth } from '../../redux/actions/auth';
import { authOtherService } from '../../redux/actions/authOtherService';
import { renderInputs } from '../../page/helpersPage';
import ImageComponent from '../imageComponent/ImageComponent';
import ButtonIcon from '../UI/buttonIcon';
import imgLogo from '../../assets/images/logo.png';
import imgGoogle from '../../assets/images/auth_service_google.svg';
import imgGithub from '../../assets/images/auth_service_github.svg';
import imgTwitter from '../../assets/images/auth_service_twitter.svg';

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
          errorMessage: 'enter password, min length 6 symbols',
          type: 'password',
        },
        { required: true, minLength: 6 },
      ),
    },
  };

  loginHandler = () => {
    const {
      authInput: { email, password },
    } = this.state;
    this.props.auth(email.value, password.value, true);
  };

  loginHandlerWithGoogle = ({ target }) => {
    this.props.authOtherService(target.closest('button').id);
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  onHandleInput = (controlName) => (event) => {
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
            {renderInputs(authInput, disabled, this.onHandleInput, this.onHandleFinishEditing, this.onHandleFocus)}
            <br />
            <div className=' row'>
              <Button
                id='google'
                className='btn-auth'
                name={<ButtonIcon src={imgGoogle} name='Google' />}
                onClick={this.loginHandlerWithGoogle}
              />
              <Button
                id='github'
                className='btn-auth'
                name={<ButtonIcon src={imgGithub} name='Github' />}
                onClick={this.loginHandlerWithGoogle}
              />
              <Button
                id='twitter'
                className='btn-auth'
                name={<ButtonIcon src={imgTwitter} name='Twitter' />}
                onClick={this.loginHandlerWithGoogle}
              />
            </div>
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
  authOtherService: PropTypes.func.isRequired,
};

const mapStateToProps = ({ authData: { onNotification, notification } }) => ({
  onNotification,
  notification,
});

const mapDispatchToProps = (dispatch) => ({
  auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin)),
  authOtherService: (service) => dispatch(authOtherService(service)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
