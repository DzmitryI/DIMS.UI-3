import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DisplayNotification from '../displayNotification';
import Input from '../UI/input';
import Button from '../UI/button';
import Radio from '../UI/radio';
import { createControl, validateControl } from '../../services/helpers';
import { auth } from '../../store/actions/auth';
import imgLogo from '../../assets/images/logo.png';

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

  loginHandler = () => {
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

  handleRadioClick = ({ target: { value } }) => {
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
    const { base, isFormValid } = this.state;
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className='auth'>
          {/* <h1>Authorization</h1> */}
          <img src={imgLogo} with='100px' height='35px' alt='logo' />
          <form onSubmit={this.submitHandler}>
            {this.renderInputs()}
            <fieldset className='base-wrap'>
              <legend className='legend-auth'>Use base</legend>
              <Radio value='firebase' checked={base === 'firebase'} onClick={this.handleRadioClick} label='Firebase' />
              <Radio value='azure' checked={base !== 'firebase'} onClick={this.handleRadioClick} label='Azure' />
            </fieldset>
            <div className='form-group row'>
              <Button type='success' id='Login' name='Log in' disabled={!isFormValid} onClick={this.loginHandler} />
              <Button type='submit' name='Register' disabled={!isFormValid} onClick={this.registerHandler} />
            </div>
          </form>
        </div>
      </>
    );
  }
}

Auth.propTypes = {
  onNotification: PropTypes.bool.isRequired,
  notification: PropTypes.object.isRequired,
  auth: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { onNotification, notification } }) => {
  return {
    onNotification,
    notification,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, base, isLogin) => dispatch(auth(email, password, base, isLogin)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
