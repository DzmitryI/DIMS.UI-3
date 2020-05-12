import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import ErrorIndicator from '../errorIndicator/ErrorIndicator';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import ButtonLink from '../UI/buttonLink';
import { headerMembersGrid, h1MemberPage, getDate } from '../helpersComponents';
import { withTheme } from '../../hoc';
import { fetchMembers, fetchMembersDelete } from '../../store/actions/members';
import Cell from '../UI/cell/Cell';

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
    const { directions } = this.props;
    this.props.onRegisterClick(directions, h1MemberPage.get('Create'));
  };

  onChangeClick = ({ target }) => {
    const { directions, members, onRegisterClick } = this.props;
    const memberId = target.closest('tr').id;
    const member = members.filter((member) => member.userId === memberId);
    if (target.id === 'edit') {
      onRegisterClick(directions, h1MemberPage.get('Edit'), member);
    } else {
      onRegisterClick(directions, h1MemberPage.get('Detail'), member);
    }
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

  countAge = (value) => {
    const curDate = new Date();
    const birthDate = new Date(value);
    const age = curDate.getFullYear() - birthDate.getFullYear();
    return curDate.setFullYear(curDate.getFullYear()) < birthDate.setFullYear(curDate.getFullYear()) ? age - 1 : age;
  };

  renderTBody = (members, directions) => {
    return members.map((member, index) => {
      const { userId, fullName, directionId, education, startDate, birthDate, age } = member;
      const curDirect = directions.find((direction) => direction.value === directionId);
      return (
        <tr key={userId} id={userId}>
          <Cell className='td index' value={index + 1} />
          <Cell value={<span onClick={this.onChangeClick}>{`${fullName}`}</span>} />
          <Cell value={`${!!curDirect && curDirect.name}`} />
          <Cell value={`${education}`} />
          <Cell value={getDate(startDate)} />
          <Cell value={(birthDate && `${this.countAge(birthDate)}`) || age} />
          <Cell
            className='td buttons-wrap'
            value={
              <>
                <ButtonLink
                  className='btn-progress'
                  onClick={this.onProgressClick}
                  name='Progress'
                  to={'/MemberProgressGrid'}
                />
                <ButtonLink className='btn-tasks' onClick={this.onShowClick} name='Tasks' to={'/MemberTasksGrid'} />
                <Button className='btn-edit' onClick={this.onChangeClick} id='edit' name='Edit' />
                <Button className='btn-delete' onClick={this.onDeleteClick} name='Delete' />
              </>
            }
          />
        </tr>
      );
    });
  };

  render() {
    const { members, directions, loading, onNotification, notification, theme, error, errorMessage } = this.props;
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
            <Button className='btn-register' onClick={this.onRegisterClick} name='Register' />
            <table border='1' className={`${theme}--table`}>
              <thead>
                <HeaderTable arr={headerMembersGrid} />
              </thead>
              <tbody>{members && this.renderTBody(members, directions)}</tbody>
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
  members: PropTypes.array.isRequired,
  directions: PropTypes.array.isRequired,
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
};

const mapStateToProps = ({
  members: { members, directions, loading, error, errorMessage, onNotification, notification },
}) => {
  return {
    members,
    directions,
    loading,
    error,
    errorMessage,
    onNotification,
    notification,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMembers: () => dispatch(fetchMembers()),
    fetchMembersDelete: (memberId, members) => dispatch(fetchMembersDelete(memberId, members)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MembersGrid));
