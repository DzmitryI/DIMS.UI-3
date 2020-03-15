import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Spinner from '../spinner';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';

export default class MembersGrid extends Component {
  state = {
    headerTable: ['#', 'Full Name', 'Direction', 'Education', 'Start', 'Age', ''],
    members: [],
    directions: [],
    loading: true,
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

  async componentDidUpdate(prevProps) {
    if (this.props.isRegister !== prevProps.isRegister) {
      const members = await this.fetchService.getAllMember();
      this.setState({
        members,
      });
    }
  }

  countAge(value) {
    const curDate = new Date();
    const birthDate = new Date(value);
    const age = curDate.getFullYear() - birthDate.getFullYear();
    return curDate.setFullYear(curDate.getFullYear()) < birthDate.setFullYear(curDate.getFullYear()) ? age - 1 : age;
  }

  onRegisterClick = () => {
    const { directions, h1MemberPage } = this.state;
    this.props.onRegisterClick(directions, h1MemberPage.get('Create'));
  };

  onChangeClick = ({ target }) => {
    const { directions, h1MemberPage, members } = this.state;
    const editMemberId = target.closest('tr').id;
    const curMembers = members.filter((el) => el.userId === editMemberId);
    if (target.className === 'btn btn-tasks') {
      this.props.onRegisterClick(directions, h1MemberPage.get('Edit'), curMembers);
    } else {
      this.props.onRegisterClick(directions, h1MemberPage.get('Detail'), curMembers);
    }
  };

  onDeleteClick = async ({ target }) => {
    const delMemberId = target.closest('tr').id;
    const [member] = this.state.members.filter((el) => el.userId === delMemberId);
    const {
      values: { name, lastName },
    } = member;
    const response = await this.fetchService.delMember(delMemberId);
    if (response.statusText) {
      alert(`${name} ${lastName} was deleted`);
    }
    const members = await this.fetchService.getAllMember();
    this.setState({ members });
  };

  render() {
    const { members, directions, loading, headerTable } = this.state;
    const { onTaskClick, isOpen } = this.props;
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={`members-wrap ${isOpen ? 'close' : ''}`}>
        <h1>Members Manage Grid</h1>
        <Button className='btn btn-register' onClick={this.onRegisterClick} name='Register' />
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
