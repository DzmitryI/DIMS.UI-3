import React, { Component } from 'react';
import Spinner from '../spinner';
import HeaderTable from '../UI/headerTable';
import { headerMemberProgressGrid, h1TaskPage, updateMemberProgress } from '../helpersComponents';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context';

export default class MemberProgressGrid extends Component {
  state = {
    memberProgresses: [],
    loading: true,
    title: '',
  };

  async componentDidMount() {
    const { userId, title } = this.props;
    const memberProgresses = await updateMemberProgress(userId);
    this.setState({ memberProgresses, loading: false, title });
  }

  async componentDidUpdate(prevProps) {
    const { userId, title } = this.props;
    if (userId !== prevProps.userId) {
      this.setState({
        loading: false,
        title,
      });
    }
  }

  onShowClick = ({ target }) => {
    const { memberProgresses } = this.state;
    const result = memberProgresses.find((memberProgress) => memberProgress.userTaskTrack.taskTrackId === target.id);
    const { task } = result;
    this.props.onTaskClick(h1TaskPage.get('Detail'), task);
  };

  render() {
    const { memberProgresses, loading, title } = this.state;
    if (loading) {
      return <Spinner />;
    }
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <div className={`grid-wrap`}>
            <span>
              <Link to='/MembersGrid'>back to grid</Link>
            </span>
            <h1>Member Progress Grid</h1>
            <table border='1' className={`${theme}--table`}>
              <caption>{title ? `${title}'s progress:` : null}</caption>
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
                        <span onClick={this.onShowClick} id={taskTrackId}>
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
  }
}
