import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Spinner from '../spinner';
import DisplayNotification from '../displayNotification';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import Button from '../UI/button';
import { withTheme, withRole, withFetchService } from '../../hoc';
import { statusThePageTrack, statusThePageTask } from '../../redux/actions/statusThePage';
import Cell from '../UI/cell/Cell';
import Row from '../UI/row/Row';
import { updateDataMemberProgress, getDate, getSortUp, getSortDown } from '../helpersComponents';
import { headerTaskTrackGrid, h1TaskTrackPage, TABLE_ROLES, handleSortEnd } from '../helpersComponentPageMaking';

class TaskTracksGrid extends Component {
  state = {
    tracks: [],
    loading: true,
    onNotification: false,
    notification: {},
    error: false,
    errorMessage: '',
  };

  componentDidMount() {
    this.fetchMemberProgress();
  }

  componentDidUpdate(prevProps) {
    const { isTrackPageOpen } = this.props;
    if (isTrackPageOpen !== prevProps.isTrackPageOpen) {
      this.setState({ loading: true });
      this.fetchMemberProgress();
    }
  }

  onChangeClick = ({ target }) => {
    const { tracks } = this.state;
    const { onTrackClick, statusThePageTrack } = this.props;
    const taskTrackId = target.closest('tr').id;
    const { userTaskTrack, task } = tracks.find((track) => track.userTaskTrack.taskTrackId === taskTrackId);
    const [{ name }] = task;
    if (target.id === 'edit') {
      onTrackClick(userTaskTrack.index, userTaskTrack.userTaskId, h1TaskTrackPage.get('Edit'), name, userTaskTrack);
    } else {
      onTrackClick(userTaskTrack.index, userTaskTrack.userTaskId, h1TaskTrackPage.get('Detail'), name, userTaskTrack);
    }
    statusThePageTrack(true);
  };

  onDeleteClick = async ({ target }) => {
    const taskTrackId = target.closest('tr').id;
    try {
      await this.props.fetchService.delTaskTrack(taskTrackId);
      const notification = { title: 'Task track was deleted' };
      this.setState({ onNotification: true, notification });
      setTimeout(() => this.setState({ onNotification: false, notification: {} }), 5000);
      this.fetchMemberProgress();
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  };

  handleSortClick = ({ target: { classList } }) => {
    const { tracks } = this.state;
    handleSortEnd();
    classList.toggle('active');
    const [, classNameParent, classNameChild] = classList;
    if (classList.value.includes('up')) {
      tracks.sort(getSortUp(classNameParent, classNameChild));
    } else {
      tracks.sort(getSortDown(classNameParent, classNameChild));
    }
    this.setState({ tracks });
  };

  moveRow = async (dragIndex, hoverIndex) => {
    const { tracks } = this.state;
    const { userTaskTrack: dragRow } = tracks[dragIndex];
    dragRow.index = hoverIndex;
    const { userTaskTrack: hoverRow } = tracks[hoverIndex];
    hoverRow.index = dragIndex;
    try {
      await this.props.fetchService.editTaskTrack(dragRow.taskTrackId, dragRow);
      await this.props.fetchService.editTaskTrack(hoverRow.taskTrackId, hoverRow);
    } catch ({ message }) {
      this.setState({ error: true, errorMessage: message });
    }
    this.setState({ tracks });
  };

  async fetchMemberProgress() {
    try {
      const { taskId } = this.props;
      const tracks = await updateDataMemberProgress('', taskId);
      this.setState({ tracks, loading: false });
    } catch ({ message }) {
      this.setState({ loading: false, error: true, errorMessage: message });
    }
  }

  renderTBody = (tracks, adminMentor) => {
    return tracks.map((track, index) => {
      const {
        userTaskTrack: { taskTrackId, trackDate, trackNote },
        task: [task],
      } = track;
      const { name } = task;
      return (
        <Row
          key={taskTrackId}
          id={taskTrackId}
          index={index}
          moveRow={this.moveRow}
          value={
            <>
              <Cell className='td index' value={index + 1} />
              <Cell value={<span onClick={this.onChangeClick}>{name}</span>} />
              <Cell value={trackNote} />
              <Cell value={getDate(trackDate)} />
              <Cell
                value={
                  <>
                    <Button
                      className='btn-edit'
                      onClick={this.onChangeClick}
                      id='edit'
                      name='Edit'
                      disabled={adminMentor}
                    />
                    <Button className='btn-delete' onClick={this.onDeleteClick} name='Delete' disabled={adminMentor} />
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
    const { tracks, loading, notification, onNotification, error, errorMessage } = this.state;
    const { theme, email } = this.props;
    const { isAdmin, isMentor } = TABLE_ROLES;
    const adminMentor = email === isAdmin || email === isMentor;

    if (loading) {
      return <Spinner />;
    }

    return (
      <div className='grid-wrap'>
        <Link to='/MemberTasksGrid'>back to grid</Link>
        <h1>Task Tracks Manage Grid</h1>
        {error ? (
          <ErrorIndicator errorMessage={errorMessage} />
        ) : (
          <table border='1' className={`${theme}--table`}>
            <caption>This is your task tracks</caption>
            <thead>
              <HeaderTable arr={headerTaskTrackGrid} onClick={this.handleSortClick} />
            </thead>
            <tbody>{this.renderTBody(tracks, adminMentor)}</tbody>
          </table>
        )}
        {onNotification && <DisplayNotification notification={notification} />}
      </div>
    );
  }
}

TaskTracksGrid.propTypes = {
  taskId: PropTypes.string.isRequired,
  isTrackPageOpen: PropTypes.bool.isRequired,
  fetchService: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  theme: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onTrackClick: PropTypes.func.isRequired,
};

const mapStateToProps = ({ statusThePage: { isTrackPageOpen } }) => ({
  isTrackPageOpen,
});

const mapDispatchToProps = (dispatch) => {
  return {
    statusThePageTrack: (status) => dispatch(statusThePageTrack(status)),
    statusThePageTask: (status) => dispatch(statusThePageTask(status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withFetchService(withRole(withTheme(TaskTracksGrid))));
