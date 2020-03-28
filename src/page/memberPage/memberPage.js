import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';
import Select from '../../components/UI/select';
import Button from '../../components/UI/button';
import Spinner from '../../components/spinner';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue, updateInput } from '../helpersPage';
import { h1MemberPage } from '../../components/helpersComponents';

export default class MemberPage extends Component {
  state = {
    isFormValid: false,
    memberInput: {
      name: createControl(
        {
          label: 'Name',
          errorMessage: 'enter user name',
        },
        { required: true },
      ),
      lastName: createControl(
        {
          label: 'Last name',
          errorMessage: 'enter user last name',
        },
        { required: true },
      ),
      email: createControl(
        {
          label: 'Email',
          errorMessage: 'enter correct email',
        },
        { required: true, email: true },
      ),
      education: createControl(
        {
          label: 'Education',
          errorMessage: 'enter education',
        },
        { required: true },
      ),
      birthDate: createControl(
        {
          label: 'Bith date',
          errorMessage: 'enter bith date',
          type: 'date',
        },
        { required: true },
      ),
      universityAverageScore: createControl(
        {
          label: 'University average score',
          errorMessage: 'enter university average score',
          type: 'number',
        },
        { required: true },
      ),
      mathScore: createControl(
        {
          label: 'Math score',
          errorMessage: 'enter math score',
          type: 'number',
        },
        { required: true },
      ),
      address: createControl(
        {
          label: 'Address',
          errorMessage: 'enter address',
        },
        { required: true },
      ),
      mobilePhone: createControl(
        {
          label: 'Mobile phone',
          errorMessage: 'enter mobile phone',
        },
        { required: true },
      ),
      skype: createControl(
        {
          label: 'Skype',
          errorMessage: 'enter skype',
        },
        { required: true },
      ),
      startDate: createControl(
        {
          label: 'Start date',
          errorMessage: 'enter start date',
          type: 'date',
        },
        { required: true },
      ),
    },
    memberSelect: {
      direction: {
        label: 'Direction',
        name: 'direction',
        options: [],
      },
      sex: {
        label: 'Sex',
        name: 'sex',
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
    disabled: false,
    loading: true,
    directions: [],
  };

  fetchService = new FetchService();

  componentDidUpdate(prevProps) {
    const { member, directions, title } = this.props;
    const { direction, sex } = this.state.memberSelect;
    let disabled = false;
    if (title !== prevProps.title && title === h1MemberPage.get('Create')) {
      this.setState({ loading: false });
    }
    if (member.length) {
      const [{ userId, values }] = member;
      if (direction.options.length === 0) {
        const memberSelect = { ...this.state.memberSelect };
        memberSelect.direction.options = directions;
        this.setState({ memberSelect });
      }
      if (member !== prevProps.member) {
        const memberInput = updateInput(this.state.memberInput, values);
        const memberSelect = { ...this.state.memberSelect };
        Object.keys(memberSelect).forEach((key) => {
          if (key === direction.name) {
            memberSelect[key].options = directions;
            memberSelect[key].options.forEach((direction, index) => {
              if (direction.value === values.directionId) {
                memberSelect[key].options[index].selected = true;
              }
            });
          } else if (key === sex.name) {
            memberSelect[key].options.forEach((sex, index) => {
              if (sex.value === values.sex) {
                memberSelect[key].options[index].selected = true;
              }
            });
          }
        });
        if (title === h1MemberPage.get('Detail')) {
          disabled = true;
        }
        this.setState({
          memberInput,
          memberSelect,
          userId,
          isFormValid: true,
          member: values,
          directions,
          disabled,
          loading: false,
        });
      }
    }
  }

  onHandlelInput = (controlName) => (event) => this.handleInput(event, controlName);
  handleInput = ({ target: { value } }, controlName) => {
    const memberInput = { ...this.state.memberInput };
    const member = { ...this.state.member };
    memberInput[controlName].value = value;
    memberInput[controlName].touched = true;
    memberInput[controlName].valid = validateControl(value, memberInput[controlName].validation);
    member[controlName] = value;
    let isFormValid = true;
    Object.keys(memberInput).forEach((name) => {
      isFormValid = memberInput[name].valid && isFormValid;
    });
    this.setState({ memberInput, member, isFormValid });
  };

  handleSelect = ({ target }) => {
    const member = { ...this.state.member };
    const { direction } = this.state.memberSelect;
    if (target.id === direction.name) {
      member['directionId'] = target.options[target.selectedIndex].value;
    } else {
      member[target.id] = target.options[target.selectedIndex].value;
    }
    this.setState({ member });
  };

  submitHandler = (event) => {
    event.preventDefault();
  };

  createMemberHandler = async () => {
    const { userId, member, memberInput, directions } = this.state;
    if (!userId) {
      const response = await this.fetchService.setMember(member);
      if (response.statusText) {
        alert(`add new member: ${member.name} ${member.lastName}`);
      }
    } else {
      const response = await this.fetchService.editMember(userId, member);
      if (response.statusText) {
        alert(`edit member: ${member.name} ${member.lastName}`);
      }
    }
    const res = clearOblectValue(memberInput, member);
    this.setState({ memberInput: res.objInputClear, member: res.objElemClear, userId: '' });
    this.props.onRegisterClick(directions);
  };

  buttonCloseClick = () => {
    const { directions, memberInput, member } = this.state;
    const res = clearOblectValue(memberInput, member);
    this.setState({
      memberInput: res.objInputClear,
      member: res.objElemClear,
      userId: '',
      isFormValid: false,
      disabled: false,
      loading: true,
    });
    this.props.onRegisterClick(directions);
  };

  renderInputs() {
    const { disabled, memberInput } = this.state;
    return Object.keys(memberInput).map((controlName, index) => {
      const control = memberInput[controlName];
      return (
        <Input
          key={controlName + index}
          id={controlName + index}
          type={control.type}
          value={control.value}
          valid={control.valid}
          touched={control.touched}
          label={control.label}
          disabled={disabled}
          errorMessage={control.errorMessage}
          shouldValidation={!!control.validation}
          onChange={this.onHandlelInput(controlName)}
        />
      );
    });
  }

  renderSelect() {
    const { memberSelect, member, disabled } = this.state;
    return Object.keys(memberSelect).map((controlName) => {
      const control = memberSelect[controlName];
      let defaultValue = false;
      let options = [];
      const { directions } = this.props;
      if (controlName === memberSelect.direction.name) {
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
          disabled={disabled}
          onChange={(event) => this.handleSelect(event, controlName)}
        />
      );
    });
  }

  render() {
    const { member, disabled, loading } = this.state;
    const { isOpen, title } = this.props;
    return (
      <>
        <div className={isOpen ? `page-wrap` : `page-wrap close`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <h1 className='subtitle'>{`${member.name} ${member.lastName}`}</h1>
                {this.renderInputs()}
                {this.renderSelect()}
                <div className='form-group row'>
                  <Button
                    className='btn btn-add'
                    disabled={disabled || !this.state.isFormValid}
                    type='submit'
                    onClick={this.createMemberHandler}
                    name='Save'
                  />
                  <Button className='btn btn-close' onClick={this.buttonCloseClick} name='Back to grid' />
                </div>
              </>
            )}
          </form>
        </div>
        {isOpen && <Backdrop />}
      </>
    );
  }
}
