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
          errorMessage: 'enter password',
          type: 'password',
        },
        { required: true, minLenght: 6 },
      ),
    },
    baseSelect: {
      base: {
        label: 'Base',
        name: 'base',
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
    base: 'firebase',
  };

  loginHandler = () => {
    const {
      authInput: { email, password },
      base,
    } = this.state;
    this.props.auth(email.value, password.value, base, true);
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

  onHandlelSelect = (controlName) => (event) => this.handleSelect(event, controlName);

  handleSelect = ({ target }) => {
    const base = target.options[target.selectedIndex].value;
    this.setState({ base });
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

  renderSelect() {
    const { baseSelect, base } = this.state;
    return Object.keys(baseSelect).map((controlName) => {
      const control = baseSelect[controlName];
      let defaultValue = false;
      let options = [];
      defaultValue = base;
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
        <React.StrictMode>
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
        </React.StrictMode>
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
