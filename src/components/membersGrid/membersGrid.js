import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Spinner from '../spinner';
import Button from '../UI/button';
import ButtonLink from '../UI/buttonLink';
import HeaderTable from '../UI/headerTable';
import { headerMembersGrid, h1MemberPage } from '../helpersComponents';

export default class MembersGrid extends Component {
  state = {
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
    const { directions } = this.state;
    this.props.onRegisterClick(directions, h1MemberPage.get('Create'));
  };

  onChangeClick = ({ target }) => {
    const { directions, members } = this.state;
    const memberId = target.closest('tr').id;
    const member = members.filter((member) => member.userId === memberId);
    if (target.className === 'btn btn-edit') {
      this.props.onRegisterClick(directions, h1MemberPage.get('Edit'), member);
    } else {
      this.props.onRegisterClick(directions, h1MemberPage.get('Detail'), member);
    }
  };

  onDeleteClick = async ({ target }) => {
    const memberId = target.closest('tr').id;
    const [member] = this.state.members.filter((member) => member.userId === memberId);
    const { fullName } = member;
    const response = await this.fetchService.delMember(memberId);
    if (response.statusText) {
      alert(`${fullName} was deleted`);
    }
    const members = await this.fetchService.getAllMember();
    this.setState({ members });
  };

  onShowClick = ({ target }) => {
    const memberId = target.closest('tr').id;
    const [member] = this.state.members.filter((member) => member.userId === memberId);
    const {
      values: { name },
    } = member;
    this.props.onTaskClick(memberId, name);
  };

  onProgressClick = ({ target }) => {
    const memberId = target.closest('tr').id;
    const [member] = this.state.members.filter((member) => member.userId === memberId);
    const {
      values: { name },
    } = member;
    console.log(name);
    this.props.onProgressClick(memberId, name);
  };

  render() {
    const { members, directions, loading } = this.state;
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className={`grid-wrap`}>
        <h1>Members Manage Grid</h1>
        <Button className='btn btn-register' onClick={this.onRegisterClick} name='Register' />
        <table border='1'>
          <thead>
            <HeaderTable arr={headerMembersGrid} />
          </thead>
          <tbody>
            {members.map((member, index) => {
              const {
                userId,
                fullName,
                values: { directionId, education, startDate, birthDate },
              } = member;
              const curDirect = directions.find((direction) => direction.value === directionId);
              return (
                <tr key={userId} id={userId}>
                  <td className='td'>{index + 1}</td>
                  <td className='td'>
                    <span onClick={this.onChangeClick}>{`${fullName}`}</span>
                  </td>
                  <td className='td'>{`${curDirect.name}`}</td>
                  <td className='td'>{`${education}`}</td>
                  <td className='td'>{`${startDate}`}</td>
                  <td className='td'>{`${this.countAge(birthDate)}`}</td>
                  <td className='td buttons-wrap'>
                    <ButtonLink
                      className='btn btn-progress'
                      onClick={this.onProgressClick}
                      name='Progress'
                      to={'/MemberProgressGrid'}
                    />
                    <ButtonLink
                      className='btn btn-tasks'
                      onClick={this.onShowClick}
                      name='Tasks'
                      to={'/MemberTasksGrid'}
                    />
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
