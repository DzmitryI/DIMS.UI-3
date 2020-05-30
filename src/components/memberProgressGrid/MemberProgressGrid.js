import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import update from 'immutability-helper';
import Spinner from '../spinner';
import HeaderTable from '../UI/headerTable';
import ErrorIndicator from '../errorIndicator';
import { headerMemberProgressGrid, h1TaskPage, updateMemberProgress, getDate } from '../helpersComponents';
import { withTheme } from '../../hoc';
import Cell from '../UI/cell/Cell';
import Row from '../UI/row/Row';

const MemberProgressGrid = ({ userId, title, onTaskClick, theme }) => {
  const [memberProgresses, setMemberProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMemberProgresses(await updateMemberProgress(userId));
        setLoading(false);
      } catch ({ message }) {
        setLoading(false);
        setError(true);
        setErrorMessage(message);
      }
    };
    fetchData();
  }, [userId]);

  const onShowClick = ({ target }) => {
    const result = memberProgresses.find((memberProgress) => memberProgress.userTaskTrack.taskTrackId === target.id);
    const { task } = result;
    onTaskClick(h1TaskPage.get('Detail'), task);
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
            <HeaderTable arr={headerMemberProgressGrid} />
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
  theme: PropTypes.string.isRequired,
};

export default withTheme(MemberProgressGrid);
