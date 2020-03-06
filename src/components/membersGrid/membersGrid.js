import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Spinner from '../spinner';
import Button from '../UI/button';

export default class MembersGrid extends Component {
  state = {
    itemList: null,
    members: [],
    directions: [],
    loading: true,
  };

  fetchService = new FetchService();

  async componentDidMount() {
    const members = await this.fetchService.getAllMember();
    const directions = await this.fetchService.getDirection();
    this.setState({
      members,
      directions,
      loading: false,
    });
  }

  countAge(value) {
    const curDate = new Date();
    const birthDate = new Date(value);
    const age = curDate.getFullYear() - birthDate.getFullYear();
    return curDate.setFullYear(curDate.getFullYear()) < birthDate.setFullYear(curDate.getFullYear()) ? age - 1 : age;
  }

  onChangeClick = ({ target }) => {
    const editMemberId = target.closest('tr').id;
    const curMembers = this.state.members.filter((el) => el.userId === editMemberId);
    const { directions } = this.state;
    if (target.tagName === 'BUTTON') {
      this.props.onRegisterClick(curMembers, directions, 'Edit Member page');
    } else {
      this.props.onRegisterClick(curMembers, directions, 'Detail Member page');
    }
  };

  onDeleteClick = async ({ target }) => {
    const delMemberId = target.closest('tr').id;
    const curMembers = this.state.members;
    this.setState({ members: curMembers.filter((el) => el.userId !== delMemberId) });
    const getData = this.fetchService.delMember;
    try {
      await getData(delMemberId);
    } catch (err) {
      alert(err);
    }
  };

  render() {
    const { members, directions, loading } = this.state;
    const { onRegisterClick, onTaskClick, isOpen } = this.props;
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={isOpen ? `member-wrap close` : `member-wrap`}>
        <h1>Members Manage Grid</h1>
        <Button
          className='btn btn-register'
          onClick={() => onRegisterClick([], directions, 'Create Member page')}
          name='Register'
        />
        <table border='1'>
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
              const {
                userId,
                values: { name, lastName, directionId, education, startDate, birthDate },
              } = member;
              const curDirect = directions.find((el) => el.value === directionId);
              return (
                <tr key={userId} id={userId}>
                  <td className='td'>{index + 1}</td>
                  <td className='td'>
                    <span onClick={this.onChangeClick}>{`${name} ${lastName}`}</span>
                  </td>
                  <td className='td'>{`${curDirect.name}`}</td>
                  <td className='td'>{`${education}`}</td>
                  <td className='td'>{`${startDate}`}</td>
                  <td className='td'>{`${this.countAge(birthDate)}`}</td>
                  <td className='td buttons-wrap'>
                    <Button className='btn btn-progress' name='Progress' />
                    <Button className='btn btn-tasks' onClick={() => onTaskClick(name)} name='Tasks' />
                    <Button className='btn btn-edit' onClick={this.onChangeClick} name='Edit' />
                    <Button className='btn btn-delete' onClick={this.onDeleteClick} name='Delete' />
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
