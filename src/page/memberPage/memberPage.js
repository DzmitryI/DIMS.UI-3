import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';
import Select from '../../components/UI/select';
import Button from '../../components/UI/button';

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
    memberSelect: {
      direction: {
        label: 'Direction',
        options: [],
      },
      sex: {
        label: 'Sex',
        options: [
          {
            name: 'Male',
            value: 'sex1',
          },
          {
            name: 'Female',
            value: 'sex2',
          },
        ],
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
      directionId: 'direction1',
      sex: 'sex1',
    },
    userId: null,
    directions: [],
  };

  fetchService = new FetchService();

  validateControl(value, validation) {
    if (!validation) {
      return true;
    }
    let isValid = true;
    if (validation.required) {
      isValid = value.trim() !== '';
    }
    return isValid;
  }

  componentDidUpdate(prevProps) {
    const { member, directions } = this.props;

    if (member.length > 0) {
      const [{ userId, values }] = member;
      if (this.state.memberSelect.direction.options.length === 0) {
        const memberSelect = { ...this.state.memberSelect };
        memberSelect.direction.options = directions;
        this.setState({ memberSelect });
      }

      if (this.props.member !== prevProps.member && this.props.member.length !== 0) {
        const memberInput = { ...this.state.memberInput };
        Object.entries(values).forEach(([key, val]) => {
          if (memberInput[key] !== undefined) {
            memberInput[key].value = val;
            memberInput[key].touched = true;
            memberInput[key].valid = true;
          }
        });

        const memberSelect = { ...this.state.memberSelect };
        Object.keys(memberSelect).forEach((key) => {
          if (key === 'direction') {
            memberSelect[key].options = directions;
            memberSelect[key].options.forEach((el, index) => {
              if (el.value === values.directionId) {
                memberSelect[key].options[index].selected = true;
              }
            });
          } else if (key === 'sex') {
            memberSelect[key].options.forEach((el, index) => {
              if (el.value === values.sex) {
                memberSelect[key].options[index].selected = true;
              }
            });
          }
        });
        this.setState({ memberInput, memberSelect, userId, isFormValid: true, member: values, directions });
      }
    }
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
    if (target.id === 'direction') {
      member['directionId'] = target.options[target.selectedIndex].value;
    } else {
      member[target.id] = target.options[target.selectedIndex].value;
    }
    this.setState({ member });
  };

  createMemberHandler = async () => {
    const { userId, member, directions } = this.state;
    if (!userId) {
      this.fetchService.setMember(member);
    } else {
      this.fetchService.editMember(userId, member);
    }
    this.setState({ member: {}, memberInput: {}, userId: '' });
    this.props.onRegisterClick([], directions, '');
  };

  buttonCloseClick = () => {
    const { directions } = this.state;
    const memberInput = { ...this.state.memberInput };
    const member = { ...this.state.member };
    Object.keys(memberInput).forEach((key) => {
      if (memberInput[key] !== undefined) {
        memberInput[key].value = '';
        memberInput[key].touched = false;
        memberInput[key].valid = false;
        member[key] = '';
      }
    });
    this.setState({ memberInput, userId: '', isFormValid: false, member });
    this.props.onRegisterClick([], directions, '');
  };

  renderInputs() {
    return Object.keys(this.state.memberInput).map((controlName, index) => {
      const control = this.state.memberInput[controlName];
      return (
        <Input
          key={controlName + index}
          id={controlName}
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

  renderSelect() {
    return Object.keys(this.state.memberSelect).map((controlName) => {
      const control = this.state.memberSelect[controlName];
      let defaultValue = false;
      let options = [];
      const { directions } = this.props;
      const member = { ...this.state.member };
      if (controlName === 'direction') {
        defaultValue = member.directionId;
        options = directions;
      } else {
        defaultValue = member[controlName];
        options = control.options;
      }
      return (
        <Select
          key={controlName}
          options={options}
          defaultValue={defaultValue}
          label={control.label}
          name={controlName}
          id={controlName}
          onChange={(event) => this.handleSelect(event, controlName)}
        />
      );
    });
  }

  render() {
    const { name, lastName } = this.state.member;
    const { isOpen, title } = this.props;
    return (
      <>
        <div className={!isOpen ? `member-wrap close` : `member-wrap`}>
          <h1 className='title'>{title}</h1>
          <form className='member-form'>
            <h1 className='subtitle'>{`${name} ${lastName}`}</h1>
            {this.renderInputs()}
            {this.renderSelect()}
            <div className='form-group row'>
              <Button
                className='btn btn-add'
                disabled={!this.state.isFormValid}
                type='submit'
                onClick={this.createMemberHandler}
                name='Save'
              />
              <Button className='btn btn-close' onClick={this.buttonCloseClick} name='Back to grid' />
            </div>
          </form>
        </div>
        {isOpen ? <Backdrop /> : null}
      </>
    );
  }
}
