import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Spinner from '../spinner';
import Button from '../UI/button';
import ButtonLink from '../UI/buttonLink';
import HeaderTable from '../UI/headerTable';
import DisplayNotification from '../displayNotification';
import { headerMembersGrid, h1MemberPage } from '../helpersComponents';
import { ThemeContext } from '../context';

const fetchService = new FetchService();

class MembersGrid extends Component {
  state = {
    members: [],
    directions: [],
    loading: true,
  };

  async componentDidMount() {
    const members = await fetchService.getAllMember();
    const directions = await fetchService.getDirection();
    this.setState({
      members,
      directions,
      loading: false,
    });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isRegister !== prevProps.isRegister) {
      const members = await fetchService.getAllMember();
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
    if (target.id === 'edit') {
      this.props.onRegisterClick(directions, h1MemberPage.get('Edit'), member);
    } else {
      this.props.onRegisterClick(directions, h1MemberPage.get('Detail'), member);
    }
  };

  onDeleteClick = async ({ target }) => {
    const memberId = target.closest('tr').id;
    const member = this.state.members.find((member) => member.userId === memberId);
    const { fullName } = member;
    const resAllUserTasks = await fetchService.getAllUserTasks();
    if (resAllUserTasks.length) {
      const curUserTasks = resAllUserTasks.filter((resAllUserTask) => resAllUserTask.userId === memberId);
      if (curUserTasks.length) {
        for (const curUserTask of curUserTasks) {
          const responseUserTask = await fetchService.delUserTask(curUserTask.userTaskId);
          if (responseUserTask.statusText) {
            DisplayNotification({ title: `User's task was deleted` });
          }
          const responseTaskState = await fetchService.delTaskState(curUserTask.stateId);
          if (responseTaskState.statusText) {
            DisplayNotification({ title: `User's task state was deleted` });
          }
          const usersTaskTrack = await fetchService.getAllUserTaskTrack();
          if (usersTaskTrack.length) {
            for (const userTaskTrack of usersTaskTrack) {
              if (curUserTask.userTaskId === userTaskTrack.userTaskId) {
                const responseTaskTrackId = await fetchService.delTaskTrack(userTaskTrack.taskTrackId);
                if (responseTaskTrackId.statusText) {
                  DisplayNotification({ title: `Task track was deleted` });
                }
              }
            }
          }
        }
      }
    }
    const response = await fetchService.delMember(memberId);
    if (response.statusText) {
      DisplayNotification({ title: `${fullName} was deleted` });
    }
    const members = await fetchService.getAllMember();
    this.setState({ members });
  };

  onShowClick = ({ target }) => {
    const memberId = target.closest('tr').id;
    const {
      values: { name },
    } = this.state.members.find((member) => member.userId === memberId);
    this.props.onTaskClick(memberId, name);
  };

  onProgressClick = ({ target }) => {
    const memberId = target.closest('tr').id;
    const {
      values: { name },
    } = this.state.members.find((member) => member.userId === memberId);
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
        <table border='1' className={`${this.props.theme}--table`}>
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
                    <Button className='btn btn-edit' onClick={this.onChangeClick} id='edit' name='Edit' />
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

export default (props) => (
  <ThemeContext.Consumer>{(theme) => <MembersGrid {...props} theme={theme} />}</ThemeContext.Consumer>
);
