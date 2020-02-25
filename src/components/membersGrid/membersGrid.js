import React, { Component } from 'react';
import SwapiService from '../../services/swapi-service';
import Spinner from '../spinner';

export default class MembersGrid extends Component {
  state = {
    itemList: null,
    members: [],
    loading: true,
  };

  swapiService = new SwapiService();

  async componentDidMount() {
    const getData = this.swapiService.getAllMember;
    const members = await getData();
    this.setState({
      members,
      loading: false,
    });
  }

  countAge(value) {
    const curDate = new Date();
    const birthDate = new Date(value);
    const age = curDate.getFullYear() - birthDate.getFullYear();
    return curDate.setFullYear(1972) < birthDate.setFullYear(1972) ? age - 1 : age;
  }

  render() {
    const { members, loading } = this.state;
    const { onRegisterClick } = this.props;
    if (loading) {
      return <Spinner />;
    }

    return (
      <div className='members-wrap'>
        <button type='button' className='btn btn-register' onClick={this.props.onRegisterClick}>
          Register
        </button>
        <table border='1'>
          <caption>Members Manage Grid</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Direction</th>
              <th>Education</th>
              <th>Start</th>
              <th>Age</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => {
              const { value } = member;
              const [userId, { name, lastName, direction, education, startDate, birthDate }] = value;
              return (
                <tr key={userId}>
                  <td className='td'>{index + 1}</td>
                  <td className='td'>{`${name} ${lastName}`}</td>
                  <td className='td'>{`${direction}`}</td>
                  <td className='td'>{`${education}`}</td>
                  <td className='td'>{`${startDate}`}</td>
                  <td className='td'>{`${this.countAge(birthDate)}`}</td>
                  <td className='td buttons-wrap'>
                    <button className='btn btn-progress'>Progress</button>
                    <button className='btn btn-tasks'>Tasks</button>
                    <button className='btn btn-edit' onClick={onRegisterClick}>
                      Edit
                    </button>
                    <button className='btn btn-delete'>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
