import React, { useState, useEffect } from 'react';
import Spinner from '../spinner';
import HeaderTable from '../UI/headerTable';
import { headerMemberProgressGrid, h1TaskPage, updateMemberProgress } from '../helpersComponents';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context';

const MemberProgressGrid = ({ userId, title, onTaskClick }) => {
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

  if (loading) {
    return <Spinner />;
  }
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
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
            <tbody>
              {memberProgresses.map((memberProgress, index) => {
                const {
                  userTaskTrack: { taskTrackId, trackDate, trackNote },
                  task: [task],
                } = memberProgress;
                const { name } = task;
                return (
                  <tr key={taskTrackId} id={taskTrackId}>
                    <td className='td'>{index + 1}</td>
                    <td className='td'>
                      <span onClick={onShowClick} id={taskTrackId}>
                        {name}
                      </span>
                    </td>
                    <td className='td'>{trackNote}</td>
                    <td className='td'>{trackDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default MemberProgressGrid;
