/* eslint-disable react/no-access-state-in-setstate */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import DisplayNotification from '../displayNotification';
import Button from '../UI/button';
import { createControl, validateControl, fillControl, formValid } from '../../services/helpers';
import { auth } from '../../store/actions/auth';
import imgLogo from '../../assets/images/logo.png';
import ImageComponent from '../imageComponent/ImageComponent';
import { renderInputs } from '../../page/helpersPage';

class Registration extends PureComponent {
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

  registerHandler = () => {
    const {
      authInput: { email, password },
    } = this.state;
    this.props.auth(email.value, password.value, false);
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
    const { notification, onNotification, isRegistred } = this.props;
    const { isFormValid, authInput, disabled } = this.state;
    if (isRegistred) {
      return <Redirect push to='/Auth' />;
    }
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className='auth'>
          <ImageComponent className='auth-img' src={imgLogo} alt='logo' />
          <form onSubmit={this.submitHandler}>
            {renderInputs(authInput, disabled, this.onHandlelInput, this.onHandleFinishEditing, this.onHandleFocus)}
            <br />
            <div className='form-group row'>
              <Button
                type='submit'
                id='registration'
                name='Registration'
                disabled={!isFormValid}
                onClick={this.registerHandler}
              />
            </div>
          </form>
        </div>
      </>
    );
  }
}

Registration.propTypes = {
  onNotification: PropTypes.bool.isRequired,
  isRegistred: PropTypes.bool.isRequired,
  notification: PropTypes.objectOf(PropTypes.string).isRequired,
  auth: PropTypes.func.isRequired,
};

const mapStateToProps = ({ authData: { onNotification, notification, isRegistred } }) => {
  return {
    onNotification,
    notification,
    isRegistred,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Registration);
