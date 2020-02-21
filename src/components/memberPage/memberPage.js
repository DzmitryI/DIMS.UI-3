import React, { Component } from 'react';
import SwapiService from '../../services/swapi-service';

export default class MemberPage extends Component {
  state = {
    member: {
      UserId: '',
      Name: '',
      LastName: '',
      DirectionId: '',
      Email: '',
      Sex: '',
      Education: '',
      UniversityAverageScore: '',
      MathScore: '',
      Address: '',
      MobilePhone: '',
      Scype: '',
      StartDate: '',
    },
  };

  swapiService = new SwapiService();

  handleImput = ({ target }) => {
    const member = { ...this.state.member };
    if (target.id === 'name') {
      member.Name = target.value;
    } else if (target.id === 'lastName') {
      member.LastName = target.value;
    } else if (target.id === 'direction') {
      member.LastName = target.value;
    } else if (target.id === 'email') {
      member.Email = target.value;
    } else if (target.id === 'sex') {
      member.Sex = target.value;
    } else if (target.id === 'education') {
      member.Education = target.value;
    } else if (target.id === 'bithDate') {
      member.BithDate = target.value;
    } else if (target.id === 'universityAveraheScore') {
      member.UniversityAveraheScore = target.value;
    } else if (target.id === 'mathScore') {
      member.MathScore = target.value;
    } else if (target.id === 'address') {
      member.Address = target.value;
    } else if (target.id === 'mobilePhone') {
      member.MobilePhone = target.value;
    } else if (target.id === 'scype') {
      member.Scype = target.value;
    } else if (target.id === 'startDate') {
      member.StartDate = target.value;
    }
    this.setState({ member: member });
  };

  createMemberHandler = (event) => {
    event.preventDefault();
    this.swapiService.setPeople(this.state.member);
    this.setState({ member: {} });
    this.props.onRegisterClick();
  };

  render() {
    const { Name, LastName } = this.state.member;
    return (
      <div className='memberWrap'>
        <h1 className='title'>Create Member page</h1>
        <form className='memberForm' method='post'>
          <h1 className='subtitle'>{`${Name} ${LastName}`}</h1>
          <div className='formGroup'>
            <label htmlFor='name'>Name</label>
            <input type='text' id='name' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='lastName'>Last name</label>
            <input type='text' id='lastName' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='direction'>Direction</label>
            <select id='direction' name='select'>
              <option selected value='direct1'>
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
          </div>
          <div className='formGroup'>
            <label htmlFor='sex'>Sex</label>
            <select id='sex' name='select'>
              <option selected value='sex1'>
                Male
              </option>
              <option value='sex2'>Female</option>
            </select>
          </div>
          <div className='formGroup'>
            <label htmlFor='education'>Education</label>
            <input type='text' id='education' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='bithDate'>Bith date</label>
            <input type='date' id='bithDate' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='universityAveraheScore'>University averahe score</label>
            <input type='number' id='universityAveraheScore' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='mathScore'>Math score</label>
            <input type='number' id='mathScore' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='address'>Address</label>
            <input type='text' id='address' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='mobilePhone'>Mobile phone</label>
            <input type='phone' id='mobilePhone' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='scype'>Scype</label>
            <input type='text' id='scype' onChange={this.handleImput} />
          </div>
          <div className='formGroup'>
            <label htmlFor='startDate'>Start date</label>
            <input type='date' id='startDate' onChange={this.handleImput} />
          </div>
          <div className='formGroup row'>
            <button className='btn btnAbb' type='submin' onClick={this.createMemberHandler}>
              Save
            </button>
            <button className='btn btnClose' onClick={this.props.onRegisterClick} type='button'>
              Back to grid
            </button>
          </div>
        </form>
      </div>
    );
  }
}
