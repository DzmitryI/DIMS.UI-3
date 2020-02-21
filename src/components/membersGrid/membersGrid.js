import React, { Component } from 'react';
import SwapiService from '../../services/swapi-service';

export default class MembersGrid extends Component {
  state = {
    itemList: null,
    members: [],
  };

  swapiService = new SwapiService();

  componentDidMount() {
    const getData = this.swapiService.getAllPeople;
    getData().then((members) => {
      this.setState({
        members,
      });
    });
  }

  render() {
    return (
      <div className='membersWrap'>
        <button type='button' className='btn btnRegister' onClick={this.props.onRegisterClick}>
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
            {this.state.members.map((member, index) => {
              return (
                <tr key={member.value[0]}>
                  <td className='td'>{index + 1}</td>
                  <td className='td'>{`${member.value[1].Name} ${member.value[1].LastName}`}</td>
                  <td className='td'>{`${member.value[1].DirectionId}`}</td>
                  <td className='td'>{`${member.value[1].Education}`}</td>
                  <td className='td'>{`${member.value[1].StartDate}`}</td>
                  <td className='td'>{`${member.value[1].StartDate}`}</td>
                  <td className='td buttonsWrap'>
                    <button className='btn btnProgress'>Progress</button>
                    <button className='btn btnTasks'>Tasks</button>
                    <button className='btn btnEdit' onClick={this.props.onRegisterClick}>
                      Edit
                    </button>
                    <button className='btn btnDelete'>Delete</button>
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
