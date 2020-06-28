import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MembersGrid from '../membersGrid';
import MemberTasksGrid from '../memberTasksGrid';
import MemberProgressGrid from '../memberProgressGrid';
import TasksGrid from '../tasksGrid';
import TaskTracksGrid from '../taskTracksGrid';
import MemberPage from '../../page/memberPage';
import TaskPage from '../../page/taskPage';
import TaskTrackPage from '../../page/taskTrackPage';
import AboutAppPage from '../../page/aboutAppPage';
import Chart from '../../page/chartPage/Chart';
import Header from '../UI/header';
import Main from '../UI/main';
import Auth from '../auth';
import Registration from '../registration';
import DisplayNotification from '../displayNotification';
import FetchFirebase from '../../services/fetchFirebase';
import { autoLogin } from '../../store/actions/auth';
import { ThemeContextProvider, RoleContextProvider, FetchServiceProvider } from '../context';

class App extends Component {
  state = {
    isRegister: false,
    isTask: false,
    isMemberTasks: false,
    isTaskTrack: false,
    title: '',
    subtitle: '',
    curMember: [],
    curTask: [],
    track: {},
    userId: null,
    taskId: '',
    userTaskId: '',
    theme: 'light',
    directions: [],
    fetchService: {},
    onNotification: false,
    notification: {},
  };

  async componentDidMount() {
    this.props.autoLogin();
  }

  async componentDidUpdate(prevProps) {
    const { email } = this.props;
    const fetchService = new FetchFirebase();
    if (email !== prevProps.email) {
      if (!email) {
        this.setState({ theme: 'light' });
      }
      try {
        const members = await fetchService.getAllMember();
        const member = members.find((curMember) => curMember.email === email);
        this.setState({ userId: member ? member.userId : '', fetchService, title: member ? member.name : '' });
      } catch ({ message }) {
        this.setState({ onNotification: true, notification: { title: message, status: 'error' } });
        setTimeout(() => this.setState({ onNotification: false, notification: {} }), 5000);
      }
    }
  }

  onColorSwitchClickHandler = (color) => {
    const theme = color ? 'dark' : 'light';
    this.setState({ theme });
  };

  onRegisterClickHandler = (directions, title = '', member = [], memberId = '') => {
    const { isRegister } = this.state;
    this.setState({
      isRegister: !isRegister,
      directions,
      title,
      curMember: member,
      userId: memberId,
    });
  };

  onCreateTaskClickHandler = (title = '', task = []) => {
    const { isTask } = this.state;
    this.setState({
      isTask: !isTask,
      title,
      curTask: task,
    });
  };

  onTaskClickHandler = (userId, title) => {
    const { isMemberTasks } = this.state;
    this.setState({
      isMemberTasks: !isMemberTasks,
      userId,
      title,
    });
  };

  onTrackClickHandler = (userTaskId = '', title = '', subtitle = '', track = {}) => {
    const { isTaskTrack } = this.state;
    this.setState({
      isTaskTrack: !isTaskTrack,
      userTaskId,
      title,
      subtitle,
      track,
    });
  };

  onProgressClickHandler = (userId, title) => {
    this.setState({
      userId,
      title,
    });
  };

  onOpenTaskTracksHandler = (userId = '', taskId = '') => {
    if (userId) {
      this.setState({ userId });
    } else if (taskId) {
      this.setState({ taskId });
    }
  };

  render() {
    const {
      isRegister,
      isTask,
      // isTaskTrack,
      title,
      subtitle,
      curMember,
      curTask,
      userId,
      taskId,
      userTaskId,
      track,
      directions,
      theme,
      fetchService,
      onNotification,
      notification,
    } = this.state;
    const { isAuthenticated, email } = this.props;

    let routes = (
      <Switch>
        <Route path='/Auth' exact component={Auth} />
        <Route path='/Registration' component={Registration} />
        <Redirect to='/Auth' />
      </Switch>
    );

    if (isAuthenticated) {
      routes = (
        <>
          <Header isAuthenticated={isAuthenticated} />
          <Switch>
            <Route
              path='/MembersGrid'
              render={(props) => (
                <MembersGrid
                  {...props}
                  onRegisterClick={this.onRegisterClickHandler}
                  onTaskClick={this.onTaskClickHandler}
                  onProgressClick={this.onProgressClickHandler}
                  isRegister={isRegister}
                />
              )}
              exact
            />
            <Route
              path='/MemberProgressGrid'
              render={(props) => (
                <MemberProgressGrid
                  {...props}
                  onProgressClick={this.onProgressClickHandler}
                  onTaskClick={this.onCreateTaskClickHandler}
                  userId={userId}
                  title={title}
                />
              )}
            />
            <Route
              path='/MemberTasksGrid'
              render={(props) => (
                <MemberTasksGrid
                  {...props}
                  userId={userId}
                  title={title}
                  onTrackClick={this.onTrackClickHandler}
                  onOpenTaskTracksClick={this.onOpenTaskTracksHandler}
                />
              )}
            />
            <Route
              path='/TasksGrid'
              render={(props) => (
                <TasksGrid
                  {...props}
                  onCreateTaskClick={this.onCreateTaskClickHandler}
                  onChangeNotify={this.onChangeNotify}
                  isTask={isTask}
                />
              )}
            />
            <Route
              path='/TaskTracksGrid'
              render={(props) => (
                <TaskTracksGrid
                  {...props}
                  onOpenTaskTracksClick={this.onOpenTaskTracksHandler}
                  onTrackClick={this.onTrackClickHandler}
                  onCreateTaskClick={this.onCreateTaskClickHandler}
                  taskId={taskId}
                />
              )}
            />
            <Route path='/AboutApp' component={AboutAppPage} />
            <Route path='/' component={Main} exact />
            <Redirect to='/' />
          </Switch>
        </>
      );
    }

    return (
      <main className={`${theme}`}>
        <FetchServiceProvider value={fetchService}>
          <RoleContextProvider value={email}>
            <ThemeContextProvider value={{ theme, onColorSwitchClickHandler: this.onColorSwitchClickHandler }}>
              {routes}
              <MemberPage
                onRegisterClick={this.onRegisterClickHandler}
                title={title}
                member={curMember}
                directions={directions}
              />
              <TaskPage onCreateTaskClick={this.onCreateTaskClickHandler} title={title} task={curTask} />
              <TaskTrackPage
                onTrackClick={this.onTrackClickHandler}
                track={track}
                title={title}
                taskId={taskId}
                userTaskId={userTaskId}
                subtitle={subtitle}
              />
              <Chart userId={userId} />
            </ThemeContextProvider>
          </RoleContextProvider>
        </FetchServiceProvider>
        {onNotification && <DisplayNotification notification={notification} />}
      </main>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  autoLogin: PropTypes.func.isRequired,
  email: PropTypes.string,
};

App.defaultProps = {
  email: null,
};

const mapStateToProps = ({ authData: { token, email } }) => {
  return {
    isAuthenticated: !!token,
    email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    autoLogin: () => dispatch(autoLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
