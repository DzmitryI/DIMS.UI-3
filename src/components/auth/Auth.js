/* eslint-disable react/no-access-state-in-setstate */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DisplayNotification from '../displayNotification';
import Input from '../UI/input';
import Button from '../UI/button';
import Select from '../UI/select';
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
          errorMessage: 'enter password, min lenght 6 simbols',
          type: 'password',
        },
        { required: false },
      ),
    },
    baseSelect: {
      database: {
        label: 'Database',
        name: 'database',
        options: [
          {
            name: 'Firebase',
            value: 'firebase',
          },
          {
            name: 'Azure',
            value: 'azure',
          },
        ],
      },
    },
    database: 'firebase',
  };

  loginHandler = () => {
    const {
      authInput: { email, password },
      database,
    } = this.state;
    this.props.auth(email.value, password.value, true, database);
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  onHandlelInput = (controlName) => (event) => this.handleInput(event, controlName);

  handleInput = ({ target: { value } }, controlName) => {
    const authInput = { ...this.state.authInput };
    authInput[controlName].value = value;
    authInput[controlName].touched = true;
    let isFormValid = true;
    Object.keys(authInput).forEach((name) => {
      isFormValid = authInput[name].valid && isFormValid;
    });
    this.setState({ authInput, isFormValid });
  };

  onHandleFinishEditing = (controlName) => (event) => this.handleFinishEditing(event, controlName);

  handleFinishEditing = ({ target: { value } }, controlName) => {
    const authInput = { ...this.state.authInput };
    authInput[controlName].valid = validateControl(value, authInput[controlName].validation);
    let isFormValid = true;
    Object.keys(authInput).forEach((name) => {
      isFormValid = authInput[name].valid && isFormValid;
    });
    this.setState({ authInput, isFormValid });
  };

  onHandleFocus = (controlName) => () => this.handleFocus(controlName);

  handleFocus = (controlName) => {
    const authInput = { ...this.state.authInput };
    authInput[controlName].valid = true;
    authInput[controlName].touched = true;
    this.setState({ authInput });
  };

  onHandlelSelect = (controlName) => (event) => this.handleSelect(event, controlName);

  handleSelect = ({ target }) => {
    const database = target.options[target.selectedIndex].value;
    this.setState({ database });
  };

  renderInputs() {
    const { authInput } = this.state;
    return Object.keys(authInput).map((controlName, index) => {
      const control = authInput[controlName];
      return (
        <Input
          key={controlName}
          id={controlName + index}
          type={control.type}
          value={control.value}
          valid={control.valid}
          touched={control.touched}
          label={control.label}
          errorMessage={control.errorMessage}
          shouldValidation={!!control.validation}
          onChange={this.onHandlelInput(controlName)}
          onBlur={this.onHandleFinishEditing(controlName)}
          onFocus={this.onHandleFocus(controlName)}
        />
      );
    });
  }

  renderSelect() {
    const { baseSelect, database } = this.state;
    return Object.keys(baseSelect).map((controlName) => {
      const control = baseSelect[controlName];
      let defaultValue = false;
      let options = [];
      defaultValue = database;
      options = control.options;
      return (
        <Select
          options={options}
          defaultValue={defaultValue}
          label={control.label}
          name={controlName}
          key={controlName}
          id={controlName}
          onChange={this.onHandlelSelect(controlName)}
        />
      );
    });
  }

  render() {
    const { notification, onNotification } = this.props;
    const { isFormValid } = this.state;
    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className='auth'>
          <div className='auth-img'>
            <img src={imgLogo} with='100px' height='50px' alt='logo' />
          </div>
          <form onSubmit={this.submitHandler}>
            {this.renderInputs()}
            <br />
            {this.renderSelect()}
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

const mapStateToProps = ({ auth: { onNotification, notification } }) => {
  return {
    onNotification,
    notification,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    auth: (email, password, database, isLogin) => dispatch(auth(email, password, database, isLogin)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
