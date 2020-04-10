import React, { Component } from 'react';
import FetchService from '../../services/fetch-service';
import Spinner from '../spinner';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import DisplayNotification from '../displayNotification';
import ButtonLink from '../UI/buttonLink';
import { headerMembersGrid, h1MemberPage, deleteAllElements } from '../helpersComponents';
import { ThemeContext } from '../context';
import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import { fetchMembers } from '../../store/actions/members';

const fetchService = new FetchService();
const notification = new DisplayNotification();

class MembersGrid extends Component {
  componentDidMount() {
    this.props.fetchMembers();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isRegister !== prevProps.isRegister) {
      this.props.fetchMembers();
    }
  }

  countAge(value) {
    const curDate = new Date();
    const birthDate = new Date(value);
    const age = curDate.getFullYear() - birthDate.getFullYear();
    return curDate.setFullYear(curDate.getFullYear()) < birthDate.setFullYear(curDate.getFullYear()) ? age - 1 : age;
  }

  onRegisterClick = () => {
    const { directions } = this.props;
    this.props.onRegisterClick(directions, h1MemberPage.get('Create'));
  };

  onChangeClick = ({ target }) => {
    const { directions, members } = this.props;
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
    const member = this.props.members.find((member) => member.userId === memberId);
    const { fullName } = member;
    deleteAllElements('userId', memberId);
    const response = await fetchService.delMember(memberId);
    if (response.statusText) {
      notification.notify('success', `${fullName} was deleted`);
    }
    const members = await fetchService.getAllMember();
    this.setState({ members });
  };

  onShowClick = ({ target }) => {
    const memberId = target.closest('tr').id;
    const {
      values: { name },
    } = this.props.members.find((member) => member.userId === memberId);
    this.props.onTaskClick(memberId, name);
  };

  onProgressClick = ({ target }) => {
    const memberId = target.closest('tr').id;
    const {
      values: { name },
    } = this.props.members.find((member) => member.userId === memberId);
    this.props.onProgressClick(memberId, name);
  };

  render() {
    const { members, directions, loading } = this.props;
    if (loading) {
      return <Spinner />;
    }
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div className='grid-wrap'>
            <h1>Members Manage Grid</h1>
            <Button className='btn btn-register' onClick={this.onRegisterClick} name='Register' />
            <table border='1' className={`${theme}--table`}>
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
            <ToastContainer />
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    members: state.members.members,
    directions: state.members.directions,
    loading: state.members.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMembers: () => dispatch(fetchMembers()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MembersGrid);
