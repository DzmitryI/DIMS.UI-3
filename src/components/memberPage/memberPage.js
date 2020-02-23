import React, { Component } from 'react';
import SwapiService from '../../services/swapi-service';
import Backdrop from '../UI/backdrop';

export default class MemberPage extends Component {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    isFormValid: false,
    member: {
      UserId: {
        value: '',
        // valid: false,
        // touched: false,
        // validation: {
        //   required: true,
        //   userId: true
        // }
      },
      Name: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter name',
        validation: {
          required: true,
          name: true,
        },
      },
      LastName: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter last name',
        validation: {
          required: true,
          lastName: true,
        },
      },
      DirectionId: '',
      Email: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter email',
        validation: {
          required: true,
          email: true,
        },
      },
      Sex: '',
      Education: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter education',
        validation: {
          required: true,
          education: true,
        },
      },
      BirthDate: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter bith date',
        validation: {
          required: true,
          birthDate: true,
        },
      },
      UniversityAverageScore: '',
      MathScore: '',
      Address: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter address',
        validation: {
          required: true,
          address: true,
        },
      },
      MobilePhone: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter mobile phone',
        validation: {
          required: true,
          mobilePhone: true,
        },
      },
      Skype: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter skype',
        validation: {
          required: true,
          skype: true,
        },
      },
      StartDate: {
        value: '',
        valid: false,
        touched: false,
        errorMessage: 'Enter start date',
        validation: {
          required: true,
          startDate: true,
        },
      },
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

  handleImput = ({ target }) => {
    const member = { ...this.state.member };
    if (target.id === 'name') {
      member.Name.value = target.value;
      member.Name.touched = true;
      member.Name.valid = this.validateControl(target.value, member.Name.validation);
    } else if (target.id === 'lastName') {
      member.LastName.value = target.value;
      member.LastName.touched = true;
      member.LastName.valid = this.validateControl(target.value, member.LastName.validation);
    } else if (target.id === 'direction') {
      member.DirectionId.value = target.value;
      // member.DirectionId.touched = true;
      // member.DirectionId.valid = this.validateControl(target.value, member.DirectionId.validation);
    } else if (target.id === 'email') {
      member.Email.value = target.value;
      member.Email.touched = true;
      member.Email.valid = this.validateControl(target.value, member.Email.validation);
    } else if (target.id === 'sex') {
      member.Sex.value = target.value;
    } else if (target.id === 'education') {
      member.Education.value = target.value;
      member.Education.touched = true;
      member.Education.valid = this.validateControl(target.value, member.Education.validation);
    } else if (target.id === 'birthDate') {
      member.BirthDate.value = target.value;
      member.BirthDate.touched = true;
      member.BirthDate.valid = this.validateControl(target.value, member.BirthDate.validation);
    } else if (target.id === 'universityAveraheScore') {
      member.UniversityAveraheScore.value = target.value;
      // member.UniversityAveraheScore.touched = true;
      // member.UniversityAveraheScore.valid = this.validateControl(target.value, member.UniversityAveraheScore.validation);
    } else if (target.id === 'mathScore') {
      member.MathScore.value = target.value;
      // member.MathScore.touched = true;
      // member.MathScore.valid = this.validateControl(target.value, member.MathScore.validation);
    } else if (target.id === 'address') {
      member.Address.value = target.value;
      member.Address.touched = true;
      member.Address.valid = this.validateControl(target.value, member.Address.validation);
    } else if (target.id === 'mobilePhone') {
      member.MobilePhone.value = target.value;
      member.MobilePhone.touched = true;
      member.MobilePhone.valid = this.validateControl(target.value, member.MobilePhone.validation);
    } else if (target.id === 'skype') {
      member.Skype.value = target.value;
      member.Skype.touched = true;
      member.Skype.valid = this.validateControl(target.value, member.Skype.validation);
    } else if (target.id === 'startDate') {
      member.StartDate.value = target.value;
      member.StartDate.touched = true;
      member.StartDate.valid = this.validateControl(target.value, member.StartDate.validation);
    }

    let isFormValid = true;
    Object.keys(member).forEach((name) => {
      if (
        name !== 'UserId' &&
        name !== 'DirectionId' &&
        name !== 'UniversityAverageScore' &&
        name !== 'MathScore' &&
        name !== 'BirthDate' &&
        name !== 'Sex'
      ) {
        isFormValid = member[name].valid && isFormValid;
      }
    });
    console.log(member);
    this.setState({ member: member, isFormValid: isFormValid });
  };

  createMemberHandler = (event) => {
    event.preventDefault();
    this.swapiService.setPeople(this.state.member);
    this.setState({ member: {} });
    this.props.onRegisterClick();
  };

  render() {
    const {
      Name: { value: Name },
      LastName: { value: LastName },
    } = this.state.member;
    const cls = ['memberWrap'];
    const clsInput = ['memberWrap'];
    if (!this.props.isOpen) {
      cls.push('close');
    }
    return (
      <>
        <div className={cls.join(' ')}>
          <h1 className='title'>Create Member page</h1>
          <form className='memberForm' method='post'>
            <h1 className='subtitle'>{`${Name} ${LastName}`}</h1>
            <div className='formGroup'>
              <label htmlFor='name'>Name</label>
              <input type='text' id='name' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.Name.valid,
                this.state.member.Name.touched,
                this.state.member.Name.validation.required,
              ) ? (
                <span>{this.state.member.Name.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup'>
              <label htmlFor='lastName'>Last name</label>
              <input type='text' id='lastName' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.LastName.valid,
                this.state.member.LastName.touched,
                this.state.member.LastName.validation.required,
              ) ? (
                <span>{this.state.member.LastName.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup'>
              <label htmlFor='direction'>Direction</label>
              <select id='direction' name='select'>
                <option defaultValue value='direct1'>
                  Java
                </option>
                <option value='direct2'>.NET</option>
                <option value='direct3'>JavaScript</option>
                <option value='direct4'>SalesFore</option>
              </select>
            </div>
            <div className='formGroup'>
              <label htmlFor='email'>Email</label>
              <input type='email' id='email' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.Email.valid,
                this.state.member.Email.touched,
                this.state.member.Email.validation.required,
              ) ? (
                <span>{this.state.member.Email.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup'>
              <label htmlFor='sex'>Sex</label>
              <select id='sex' name='select'>
                <option defaultValue value='sex1'>
                  Male
                </option>
                <option value='sex2'>Female</option>
              </select>
            </div>
            <div className='formGroup'>
              <label htmlFor='education'>Education</label>
              <input type='text' id='education' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.Education.valid,
                this.state.member.Education.touched,
                this.state.member.Education.validation.required,
              ) ? (
                <span>{this.state.member.Education.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup'>
              <label htmlFor='BirthDate'>Bith date</label>
              <input type='date' id='BirthDate' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.BirthDate.valid,
                this.state.member.BirthDate.touched,
                this.state.member.BirthDate.validation.required,
              ) ? (
                <span>{this.state.member.BirthDate.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup'>
              <label htmlFor='universityAveraheScore'>University averahe score</label>
              <input type='number' id='universityAveraheScore' onChange={this.handleImput} value='1' />
            </div>
            <div className='formGroup'>
              <label htmlFor='mathScore'>Math score</label>
              <input type='number' id='mathScore' onChange={this.handleImput} value='1' />
            </div>
            <div className='formGroup'>
              <label htmlFor='address'>Address</label>
              <input type='text' id='address' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.Address.valid,
                this.state.member.Address.touched,
                this.state.member.Address.validation.required,
              ) ? (
                <span>{this.state.member.Address.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup'>
              <label htmlFor='mobilePhone'>Mobile phone</label>
              <input type='phone' id='mobilePhone' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.MobilePhone.valid,
                this.state.member.MobilePhone.touched,
                this.state.member.MobilePhone.validation.required,
              ) ? (
                <span>{this.state.member.MobilePhone.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup'>
              <label htmlFor='skype'>Skype</label>
              <input type='text' id='skype' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.Skype.valid,
                this.state.member.Skype.touched,
                this.state.member.Skype.validation.required,
              ) ? (
                <span>{this.state.member.Skype.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup'>
              <label htmlFor='startDate'>Start date</label>
              <input type='date' id='startDate' onChange={this.handleImput} />
              {this.isInValid(
                this.state.member.StartDate.valid,
                this.state.member.StartDate.touched,
                this.state.member.StartDate.validation.required,
              ) ? (
                <span>{this.state.member.StartDate.errorMessage}</span>
              ) : null}
            </div>
            <div className='formGroup row'>
              <button
                className='btn btnAbb'
                disabled={!this.state.isFormValid}
                type='submin'
                onClick={this.createMemberHandler}
              >
                Save
              </button>
              <button className='btn btnClose' onClick={this.props.onRegisterClick} type='button'>
                Back to grid
              </button>
            </div>
          </form>
        </div>
        {this.props.isOpen ? <Backdrop /> : null}
      </>
    );
  }
}
