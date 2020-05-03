import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner';
import HeaderTable from '../UI/headerTable';
import { headerMemberProgressGrid, h1TaskPage, updateMemberProgress, getDate } from '../helpersComponents';
import { withTheme } from '../../hoc';
import Cell from '../UI/cell/Cell';
import PropTypes from 'prop-types';

const MemberProgressGrid = ({ userId, title, onTaskClick, theme }) => {
  const [memberProgresses, setMemberProgresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const memberProgresses = await updateMemberProgress(userId);
      setMemberProgresses(memberProgresses);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  const onShowClick = ({ target }) => {
    const result = memberProgresses.find((memberProgress) => memberProgress.userTaskTrack.taskTrackId === target.id);
    const { task } = result;
    onTaskClick(h1TaskPage.get('Detail'), task);
  };

  const renderTBody = (memberProgresses) => {
    return memberProgresses.map((memberProgress, index) => {
      const {
        userTaskTrack: { taskTrackId, trackDate, trackNote },
        task: [task],
      } = memberProgress;
      const { name } = task;
      return (
        <tr key={taskTrackId} id={taskTrackId}>
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
        </tr>
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
      <table border='1' className={`${theme}--table`}>
        <caption>{title && `${title}'s progress:`}</caption>
        <thead>
          <HeaderTable arr={headerMemberProgressGrid} />
        </thead>
        <tbody>{renderTBody(memberProgresses)}</tbody>
      </table>
    </div>
  );
};

MemberProgressGrid.propTypes = {
  userId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onTaskClick: PropTypes.func.isRequired,
  theme: PropTypes.string,
};

export default withTheme(MemberProgressGrid);
