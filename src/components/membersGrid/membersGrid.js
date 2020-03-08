import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Spinner from '../spinner';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';

export default class MembersGrid extends Component {
  state = {
    itemList: null,
    members: [],
    directions: [],
    loading: true,
    headerTable: ['#', 'Full Name', 'Direction', 'Education', 'Start', 'Age', ''],
    h1MemberPage: null,
  };

  fetchService = new FetchService();

  async componentDidMount() {
    const members = await this.fetchService.getAllMember();
    const directions = await this.fetchService.getDirection();
    let h1MemberPage = new Map();
    h1MemberPage.set('Create', 'Create Member page');
    h1MemberPage.set('Edit', 'Edit Member page');
    h1MemberPage.set('Detail', 'Detail Member page');
    this.setState({
      members,
      directions,
      loading: false,
      h1MemberPage,
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
    const { directions, h1MemberPage } = this.state;
    if (target.tagName === 'BUTTON') {
      this.props.onRegisterClick(directions, h1MemberPage.get('Edit'), curMembers);
    } else {
      this.props.onRegisterClick(directions, h1MemberPage.get('Detail'), curMembers);
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
    const { members, directions, loading, headerTable, h1MemberPage } = this.state;
    const { onRegisterClick, onTaskClick, isOpen } = this.props;
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={isOpen ? `members-wrap close` : `members-wrap`}>
        <h1>Members Manage Grid</h1>
        <Button
          className='btn btn-register'
          onClick={() => onRegisterClick(directions, h1MemberPage.get('Create'))}
          name='Register'
        />
        <table border='1'>
          <thead>
            <HeaderTable arr={headerTable} />
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
