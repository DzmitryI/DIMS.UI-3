/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import Spinner from '../spinner';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import { updateDataMemberProgress, getDate, getSort } from '../helpersComponents';
import { headerMemberProgressGrid, h1TaskPage, handleSortEnd } from '../helpersComponentPageMaking';
import { withTheme } from '../../hoc';
import Cell from '../UI/cell/Cell';
import Row from '../UI/row/Row';
import { statusThePageTask } from '../../redux/actions/statusThePage';

const MemberProgressGrid = ({ userId, title, onTaskClick, statusPageTask, theme }) => {
  const [memberProgresses, setMemberProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(false);
    try {
      setMemberProgresses(await updateDataMemberProgress(userId));
    } catch ({ message }) {
      setError(true);
      setErrorMessage(message);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onShowClick = ({ target }) => {
    const result = memberProgresses.find((memberProgress) => memberProgress.userTaskTrack.taskTrackId === target.id);
    const { task } = result;
    onTaskClick(h1TaskPage.get('Detail'), task);
    statusPageTask(true);
  };

  const handleSortClick = ({ target: { classList } }) => {
    const memberProgressArr = [...memberProgresses];
    handleSortEnd();
    classList.toggle('active');
    const [, classNameParent, classNameChild] = classList;
    if (classList.value.includes('up')) {
      memberProgressArr.sort(getSort('up', classNameParent, classNameChild));
    } else {
      memberProgressArr.sort(getSort('down', classNameParent, classNameChild));
    }
    setMemberProgresses(memberProgressArr);
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRow = memberProgresses[dragIndex];
    setMemberProgresses(
      update(memberProgresses, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      }),
    );
  };

  const renderTBody = (progresses) => {
    return progresses.map((memberProgress, index) => {
      const {
        userTaskTrack: { taskTrackId, trackDate, trackNote },
        task: [task],
      } = memberProgress;
      const { name } = task;
      return (
        <Row
          key={taskTrackId}
          id={taskTrackId}
          index={index}
          moveRow={moveRow}
          value={
            <>
              <Cell className='td index' value={index + 1} />
              <Cell
                value={
                  <span onClick={onShowClick} id={taskTrackId}>
                    {name}
                  </span>
                }
              />
              <Cell value={trackNote} />
              <Cell value={getDate(trackDate)} />
            </>
          }
        />
      );
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='grid-wrap'>
      <span>
        <Link to='/MembersGrid'>back to grid</Link>
      </span>
      <h1>Member Progress Grid</h1>
      {error ? (
        <ErrorIndicator errorMessage={errorMessage} />
      ) : (
        <table border='1' className={`${theme}--table`}>
          <caption>{title && `${title}'s progress:`}</caption>
          <thead>
            <HeaderTable arr={headerMemberProgressGrid} onClick={handleSortClick} />
          </thead>
          <tbody>{renderTBody(memberProgresses)}</tbody>
        </table>
      )}
    </div>
  );
};

MemberProgressGrid.propTypes = {
  userId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onTaskClick: PropTypes.func.isRequired,
  statusPageTask: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    statusPageTask: (status) => dispatch(statusThePageTask(status)),
  };
};

export default connect(null, mapDispatchToProps)(withTheme(MemberProgressGrid));
