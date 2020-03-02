import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Spinner from '../spinner';

export default class MembersGrid extends Component {
  state = {
    itemList: null,
    members: [],
    directions: [],
    loading: true,
  };

  fetchService = new FetchService();

  async componentDidMount() {
    const getData = this.fetchService.getAllMember;
    const members = await getData();
    const getDirection = this.fetchService.getDirection;
    const directions = await getDirection();
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
    return curDate.setFullYear(1972) < birthDate.setFullYear(1972) ? age - 1 : age;
  }

  onChangeClick = ({ target }) => {
    const editMemberId = target.closest('tr').id;
    const curMembers = [...this.state.members].filter((el) => el.value[0] === editMemberId);
    const [{ value }] = curMembers;
    const { directions } = this.state;
    if (target.tagName === 'SPAN') {
      this.props.onRegisterClick(value, directions, 'Edit Member page');
    } else {
      this.props.onRegisterClick(value, directions, 'Detail Member page');
    }
  };

  onDeleteClick = async ({ target }) => {
    const delMemberId = target.closest('tr').id;
    const curMembers = [...this.state.members];
    this.setState({ members: curMembers.filter((el) => el.value[0] !== delMemberId) });
    const getData = this.fetchService.delMember;
    try {
      await getData(delMemberId);
    } catch (err) {
      alert(err);
    }

    // const members = await getData(delMember);
    // this.setState({
    //   members,
    //   loading: false,
    // });
  };

  render() {
    const { members, directions, loading } = this.state;
    const { onRegisterClick, onTaskClick, isOpen } = this.props;
    if (loading) {
      return <Spinner />;
    }
    const cls = ['members-wrap'];
    if (isOpen) {
      cls.push('close');
    }
    return (
      <div className={cls.join(' ')}>
        <h1>Members Manage Grid</h1>
        <button
          type='button'
          className='btn btn-register'
          onClick={() => onRegisterClick([], directions, 'Create Member page')}
        >
          Register
        </button>
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
              const { value } = member;
              const [userId, { name, lastName, direction, education, startDate, birthDate }] = value;
              const { name: curDirect } = directions.find((val) => {
                const { value } = val;
                if (value === direction) {
                  return value;
                }
              });
              return (
                <tr key={userId} id={userId}>
                  <td className='td'>{index + 1}</td>
                  <td className='td'>
                    <span onClick={this.onChangeClick}>{`${name} ${lastName}`}</span>
                  </td>
                  <td className='td'>{`${curDirect}`}</td>
                  <td className='td'>{`${education}`}</td>
                  <td className='td'>{`${startDate}`}</td>
                  <td className='td'>{`${this.countAge(birthDate)}`}</td>
                  <td className='td buttons-wrap'>
                    <button className='btn btn-progress'>Progress</button>
                    <button className='btn btn-tasks' onClick={() => onTaskClick(name)}>
                      Tasks
                    </button>
                    <button className='btn btn-edit' onClick={this.onChangeClick}>
                      Edit
                    </button>
                    <button className='btn btn-delete' onClick={this.onDeleteClick}>
                      Delete
                    </button>
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
