import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import ErrorIndicator from '../errorIndicator/ErrorIndicator';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import ButtonLink from '../UI/buttonLink';
import { headerMembersGrid, h1MemberPage } from '../helpersComponents';
import { withTheme } from '../../hoc';
import { fetchMembers, fetchMembersDelete } from '../../store/actions/members';

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
    await this.props.fetchMembersDelete(memberId, this.props.members);
    await this.props.fetchMembers();
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

  renderTBody = (members, directions) => {
    return members.map((member, index) => {
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
              className='btn-progress'
              onClick={this.onProgressClick}
              name='Progress'
              to={'/MemberProgressGrid'}
            />
            <ButtonLink className='btn-tasks' onClick={this.onShowClick} name='Tasks' to={'/MemberTasksGrid'} />
            <Button className='btn-edit' onClick={this.onChangeClick} id='edit' name='Edit' />
            <Button className='btn-delete' onClick={this.onDeleteClick} name='Delete' />
          </td>
        </tr>
      );
    });
  };

  render() {
    const { members, directions, loading, onNotification, notification, theme, error } = this.props;
    if (loading) {
      return <Spinner />;
    }
    if (error) {
      return <ErrorIndicator />;
    }
    return (
      <div className='grid-wrap'>
        <h1>Members Manage Grid</h1>
        <Button className='btn-register' onClick={this.onRegisterClick} name='Register' />
        <table border='1' className={`${theme}--table`}>
          <thead>
            <HeaderTable arr={headerMembersGrid} />
          </thead>
          <tbody>{this.renderTBody(members, directions)}</tbody>
        </table>
        {onNotification && <DisplayNotification notification={notification} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    members: state.members.members,
    directions: state.members.directions,
    loading: state.members.loading,
    error: state.members.error,
    onNotification: state.members.onNotification,
    notification: state.members.notification,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMembers: () => dispatch(fetchMembers()),
    fetchMembersDelete: (memberId, members) => dispatch(fetchMembersDelete(memberId, members)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MembersGrid));
