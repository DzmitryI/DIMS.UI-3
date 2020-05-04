import React, { Component } from 'react';
import Spinner from '../../components/spinner';
import DisplayNotification from '../../components/displayNotification';
import Backdrop from '../../components/UI/backdrop';
import Input from '../../components/UI/input';
import Select from '../../components/UI/select';
import Button from '../../components/UI/button';
import { createControl, validateControl } from '../../services/helpers.js';
import { clearOblectValue, updateInput } from '../helpersPage';
import { h1MemberPage } from '../../components/helpersComponents';
import { withFetchService } from '../../hoc';
import PropTypes from 'prop-types';

class MemberPage extends Component {
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
          placeholder: 'xxxx@xx',
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
          placeholder: '+375 xx xxxxxxx',
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
    onNotification: false,
    notification: {},
    error: false,
    errorMessage: '',
  };

  componentDidUpdate(prevProps) {
    const { member, directions, title } = this.props;
    const {
      memberSelect: { direction, sex },
    } = this.state;
    let disabled = false;
    if (title !== prevProps.title && title === h1MemberPage.get('Create')) {
      this.setState({ loading: false });
    }
    if (member.length) {
      const [{ userId, ...values }] = member;
      if (!direction.options.length && directions.length) {
        const { memberSelect } = this.state;
        memberSelect.direction.options = directions;
        this.setState({ memberSelect });
      }
      if (member !== prevProps.member) {
        const memberInput = updateInput(this.state.memberInput, values);
        const { memberSelect } = this.state;
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
    const { memberInput, member } = this.state;
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

  onHandlelSelect = (controlName) => (event) => this.handleSelect(event, controlName);
  handleSelect = ({ target }) => {
    const {
      member,
      memberSelect: { direction },
    } = this.state;
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

  async changeMember(value) {
    const { userId, member, memberInput, directions } = this.state;
    const { fetchService, onRegisterClick } = this.props;
    let notification = '';
    try {
      if (value === 'edit') {
        await fetchService.editMember(userId, member);
        notification = { title: `Member: ${member.name} ${member.lastName} was edited` };
      } else {
        await fetchService.setMember(member);
        notification = { title: `New member: ${member.name} ${member.lastName} was added` };
      }
      this.setState({ onNotification: true, notification });
      const res = clearOblectValue(memberInput, member);
      this.setState({ memberInput: res.objInputClear, member: res.objElemClear, userId: '' });
      onRegisterClick(directions);
    } catch ({ message }) {
      this.setState({ onNotification: true, notification: { status: 'error', title: message } });
    }
    setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
  }

  createMemberHandler = () => {
    if (!this.state.userId) {
      this.changeMember('add');
    } else {
      this.changeMember('edit');
    }
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
          placeholder={control.placeholder}
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
          options={options}
          defaultValue={defaultValue}
          label={control.label}
          name={controlName}
          key={controlName}
          id={controlName}
          disabled={disabled}
          onChange={this.onHandlelSelect(controlName)}
        />
      );
    });
  }

  render() {
    const {
      member: { name, lastName },
      disabled,
      loading,
      isFormValid,
      onNotification,
      notification,
    } = this.state;
    const { isOpen, title } = this.props;

    return (
      <>
        {onNotification && <DisplayNotification notification={notification} />}
        <div className={`page-wrap ${isOpen ? '' : 'close'}`}>
          <h1 className='title'>{title}</h1>
          <form onSubmit={this.submitHandler} className='page-form'>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <h1 className='subtitle'>{`${name} ${lastName}`}</h1>
                {this.renderInputs()}
                {this.renderSelect()}
                <div className='form-group row'>
                  <Button
                    className='btn-add'
                    disabled={disabled || !isFormValid}
                    type='submit'
                    onClick={this.createMemberHandler}
                    name='Save'
                  />
                  <Button className='btn-close' onClick={this.buttonCloseClick} name='Back to grid' />
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

MemberPage.propTypes = {
  member: PropTypes.array.isRequired,
  directions: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  fetchService: PropTypes.object.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default withFetchService(MemberPage);
