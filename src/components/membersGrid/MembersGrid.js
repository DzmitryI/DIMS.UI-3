/* eslint-disable no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import ErrorIndicator from '../errorIndicator/ErrorIndicator';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import ButtonLink from '../UI/buttonLink';
import { getDate, countAge } from '../helpersComponents';
import { headerMembersGrid, h1MemberPage, TABLE_ROLES, handleSortEnd } from '../helpersComponentPageMaking';
import { withTheme, withRole } from '../../hoc';
import {
  fetchMembers,
  fetchMembersSuccess,
  fetchMemberChangeIndex,
  fetchMembersDelete,
  membersSort,
} from '../../redux/actions/members';
import { statusThePageMember } from '../../redux/actions/statusThePage';
import Cell from '../UI/cell';
import Row from '../UI/row';

const { isAdmin } = TABLE_ROLES;
class MembersGrid extends Component {
  async componentDidMount() {
    await this.props.fetchMembers();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.isRegister !== prevProps.isRegister) {
      await this.props.fetchMembers();
    }
  }

  onRegisterClick = () => {
    const { directions, members, statusThePageMember, onRegisterClick } = this.props;
    onRegisterClick(directions, h1MemberPage.get('Create'), members.length);
    statusThePageMember(true);
  };

  onChangeClick = ({ target }) => {
    const { directions, members, onRegisterClick } = this.props;
    const memberId = target.closest('tr').id;
    const member = members.filter((curMember) => curMember.userId === memberId);
    const [curMember] = member;
    if (target.id === 'edit') {
      onRegisterClick(directions, h1MemberPage.get('Edit'), curMember.index, member, memberId);
    } else {
      onRegisterClick(directions, h1MemberPage.get('Detail'), curMember.index, member, memberId);
    }
    this.props.statusThePageMember(true);
  };

  onDeleteClick = async ({ target }) => {
    const memberId = target.closest('tr').id;
    const { members, fetchMembersDelete, fetchMembers } = this.props;
    await fetchMembersDelete(memberId, members);
    await fetchMembers();
  };

  onShowClick = ({ target }) => {
    const memberId = target.closest('tr').id;
    const { name } = this.props.members.find((member) => member.userId === memberId);
    this.props.onTaskClick(memberId, name);
  };

  onProgressClick = ({ target }) => {
    const memberId = target.closest('tr').id;
    const { name } = this.props.members.find((member) => member.userId === memberId);
    this.props.onProgressClick(memberId, name);
  };

  moveRow = (dragIndex, hoverIndex) => {
    let { members } = this.props;
    const changeMembers = [...members];
    const { directions, fetchMembersSuccess, fetchMemberChangeIndex } = this.props;
    const dragRow = changeMembers[dragIndex];
    dragRow.index = hoverIndex;
    fetchMemberChangeIndex(dragRow.userId, dragRow);
    const hoverRow = changeMembers[hoverIndex];
    hoverRow.index = dragIndex;
    fetchMemberChangeIndex(hoverRow.userId, hoverRow);
    members = changeMembers;

    fetchMembersSuccess(members, directions);
  };

  handleSortClick = ({ target: { classList } }) => {
    const { members, directions, membersSort } = this.props;
    handleSortEnd();
    classList.toggle('active');
    membersSort(members, directions, classList);
  };

  renderTBody = (members, directions, email) => {
    return members.map((member, index) => {
      const { userId, fullName, directionId, education, startDate, birthDate, age } = member;
      const curDirect = directions.find((direction) => direction.value === directionId);
      return (
        <Row
          key={userId}
          id={userId}
          index={index}
          moveRow={this.moveRow}
          value={
            <>
              <Cell className='td index' value={index + 1} />
              <Cell value={<span onClick={this.onChangeClick}>{fullName}</span>} />
              <Cell value={!!curDirect && curDirect.name} />
              <Cell className='td education' value={education} />
              <Cell value={getDate(startDate)} />
              <Cell className='td age' value={(birthDate && countAge(birthDate)) || age} />
              <Cell
                className='td buttons-wrap'
                value={
                  <>
                    <div>
                      <ButtonLink
                        className='btn-progress'
                        onClick={this.onProgressClick}
                        name='Progress'
                        to='/MemberProgressGrid'
                      />
                      <ButtonLink className='btn-tasks' onClick={this.onShowClick} name='Tasks' to='/MemberTasksGrid' />
                    </div>
                    {isAdmin === email && (
                      <div>
                        <Button className='btn-edit' onClick={this.onChangeClick} id='edit' name='Edit' />
                        <Button className='btn-delete' onClick={this.onDeleteClick} name='Delete' />
                      </div>
                    )}
                  </>
                }
              />
            </>
          }
        />
      );
    });
  };

  render() {
    const {
      members,
      directions,
      loading,
      onNotification,
      notification,
      theme,
      email,
      error,
      errorMessage,
    } = this.props;
    if (loading) {
      return <Spinner />;
    }
    return (
      <div className='grid-wrap'>
        <h1>Members Manage Grid</h1>
        {error ? (
          <ErrorIndicator errorMessage={errorMessage} />
        ) : (
          <>
            {isAdmin === email && <Button className='btn-register' onClick={this.onRegisterClick} name='Register' />}
            <table border='1' className={`${theme}--table`}>
              <thead>
                <HeaderTable arr={headerMembersGrid} onClick={this.handleSortClick} />
              </thead>
              <tbody>{members && this.renderTBody(members, directions, email)}</tbody>
            </table>
          </>
        )}
        {onNotification && <DisplayNotification notification={notification} />}
      </div>
    );
  }
}

MembersGrid.propTypes = {
  isRegister: PropTypes.bool.isRequired,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  directions: PropTypes.arrayOf(PropTypes.object).isRequired,
  email: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onNotification: PropTypes.bool.isRequired,
  notification: PropTypes.objectOf(PropTypes.string).isRequired,
  theme: PropTypes.string.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  onTaskClick: PropTypes.func.isRequired,
  onProgressClick: PropTypes.func.isRequired,
  fetchMembersDelete: PropTypes.func.isRequired,
  fetchMembers: PropTypes.func.isRequired,
  fetchMembersSuccess: PropTypes.func.isRequired,
  fetchMemberChangeIndex: PropTypes.func.isRequired,
  membersSort: PropTypes.func.isRequired,
  statusThePageMember: PropTypes.func.isRequired,
};

const mapStateToProps = ({
  members: { members, directions, loading, error, errorMessage, onNotification, notification },
}) => ({
  members,
  directions,
  loading,
  error,
  errorMessage,
  onNotification,
  notification,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMembers: () => dispatch(fetchMembers()),
    fetchMembersDelete: (memberId, members) => dispatch(fetchMembersDelete(memberId, members)),
    fetchMembersSuccess: (members, directions) => dispatch(fetchMembersSuccess(members, directions)),
    fetchMemberChangeIndex: (memberId, member) => dispatch(fetchMemberChangeIndex(memberId, member)),
    membersSort: (members, directions, classList) => dispatch(membersSort(members, directions, classList)),
    statusThePageMember: (status) => dispatch(statusThePageMember(status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRole(withTheme(MembersGrid)));
