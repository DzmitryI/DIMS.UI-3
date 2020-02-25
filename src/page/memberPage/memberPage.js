import React, { Component } from 'react';
import SwapiService from '../../services/swapi-service';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';

export default class MemberPage extends Component {
  state = {
    isFormValid: false,
    memberInput: {
      name: {
        value: '',
        type: 'text',
        label: 'Name',
        errorMessage: 'enter user name',
        valid: false,
        touched: false,
        validation: {
          required: true,
          name: true,
        },
      },
      lastName: {
        value: '',
        type: 'text',
        label: 'Last name',
        errorMessage: 'enter user last name',
        valid: false,
        touched: false,
        validation: {
          required: true,
          lastName: true,
        },
      },
      email: {
        value: '',
        type: 'text',
        label: 'Email',
        errorMessage: 'Enter email',
        valid: false,
        touched: false,
        validation: {
          required: true,
          email: true,
        },
      },
      education: {
        value: '',
        type: 'text',
        label: 'Education',
        errorMessage: 'Enter education',
        valid: false,
        touched: false,
        validation: {
          required: true,
          education: true,
        },
      },
      birthDate: {
        value: '',
        type: 'date',
        label: 'Bith date',
        errorMessage: 'Enter bith date',
        valid: false,
        touched: false,
        validation: {
          required: true,
          birthDate: true,
        },
      },
      universityAverageScore: {
        value: '',
        type: 'number',
        label: 'University average score',
        errorMessage: 'Enter university average score',
        valid: false,
        touched: false,
        validation: {
          required: true,
          universityAverageScore: true,
        },
      },
      mathScore: {
        value: '',
        type: 'number',
        label: 'Math score',
        errorMessage: 'Enter math score',
        valid: false,
        touched: false,
        validation: {
          required: true,
          mathScore: true,
        },
      },
      address: {
        value: '',
        type: 'text',
        label: 'Address',
        errorMessage: 'Enter address',
        valid: false,
        touched: false,
        validation: {
          required: true,
          address: true,
        },
      },
      mobilePhone: {
        value: '',
        type: 'text',
        label: 'Mobile phone',
        errorMessage: 'Enter mobile phone',
        valid: false,
        touched: false,
        validation: {
          required: true,
          mobilePhone: true,
        },
      },
      skype: {
        value: '',
        type: 'text',
        label: 'Skype',
        errorMessage: 'Enter skype',
        valid: false,
        touched: false,
        validation: {
          required: true,
          skype: true,
        },
      },
      startDate: {
        value: '',
        type: 'date',
        label: 'Start date',
        errorMessage: 'Enter start date',
        valid: false,
        touched: false,
        validation: {
          required: true,
          startDate: true,
        },
      },
    },
    member: {
      name: '',
      lastName: '',
      email: '',
      education: '',
      birthDate: '',
      universityAverageScore: '',
      mathScore: '',
      address: '',
      mobilePhone: '',
      skype: '',
      startDate: '',
      direction: 'direct1',
      sex: 'sex1',
    },
  };

  swapiService = new SwapiService();

  validateControl(value, validation) {
    if (!validation) {
      return true;
    }
    let isValid = true;
    if (validation.required) {
      isValid = value.trim() !== '' && isValid;
    }
    return isValid;
  }

  isInValid(valid, touched, shouldValidation) {
    return !valid && touched && shouldValidation;
  }

  handleImput = ({ target: { value } }, controlName) => {
    const memberInput = { ...this.state.memberInput };
    const member = { ...this.state.member };
    memberInput[controlName].value = value;
    memberInput[controlName].touched = true;
    memberInput[controlName].valid = this.validateControl(value, memberInput[controlName].validation);
    member[controlName] = value;
    let isFormValid = true;
    Object.keys(memberInput).forEach((name) => {
      isFormValid = memberInput[name].valid && isFormValid;
    });
    this.setState({ memberInput, member, isFormValid });
  };

  handleSelect = ({ target }) => {
    const member = { ...this.state.member };
    member[target.id] = target.options[target.selectedIndex].value;
    this.setState({ member });
  };

  createMemberHandler = () => {
    this.swapiService.setMember(this.state.member);
    this.setState({ member: {}, memberInput: {} });
    this.props.onRegisterClick();
  };

  renderInputs() {
    return Object.keys(this.state.memberInput).map((controlName, index) => {
      const control = this.state.memberInput[controlName];
      return (
        <Input
          key={controlName + index}
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
    const { name, lastName } = this.state.member;
    const { isOpen, onRegisterClick } = this.props;
    const cls = ['member-wrap'];
    if (!isOpen) {
      cls.push('close');
    }
    return (
      <>
        <div className={cls.join(' ')}>
          <h1 className='title'>Create Member page</h1>
          <form className='member-form'>
            <h1 className='subtitle'>{`${name} ${lastName}`}</h1>

            {this.renderInputs()}

            <div className='form-group'>
              <label htmlFor='direction'>Direction</label>
              <select id='direction' name='select' onChange={this.handleSelect}>
                <option defaultValue value='direct1'>
                  Java
                </option>
                <option value='direct2'>.NET</option>
                <option value='direct3'>JavaScript</option>
                <option value='direct4'>SalesFore</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='sex'>Sex</label>
              <select id='sex' name='select' onChange={this.handleSelect}>
                <option defaultValue value='sex1'>
                  Male
                </option>
                <option value='sex2'>Female</option>
              </select>
            </div>
            <div className='form-group row'>
              <button
                className='btn btn-add'
                disabled={!this.state.isFormValid}
                type='submin'
                onClick={this.createMemberHandler}
              >
                Save
              </button>
              <button className='btn btn-close' onClick={onRegisterClick} type='button'>
                Back to grid
              </button>
            </div>
          </form>
        </div>
        {isOpen ? <Backdrop /> : null}
      </>
    );
  }
}
