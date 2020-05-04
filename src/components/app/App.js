import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import MembersGrid from '../membersGrid';
import MemberTasksGrid from '../memberTasksGrid';
import MemberProgressGrid from '../memberProgressGrid';
import TasksGrid from '../tasksGrid';
import TaskTracksGrid from '../taskTracksGrid';
import MemberPage from '../../page/memberPage';
import TaskPage from '../../page/taskPage';
import TaskTrackPage from '../../page/taskTrackPage';
import AboutAppPage from '../../page/aboutAppPage';
import Header from '../UI/header';
import Main from '../UI/main';
import Auth from '../auth';
import DisplayNotification from '../displayNotification';
import FetchFirebase from '../../services/fetchFirebase';
import FetchAzure from '../../services/fetchAzure';
import { autoLogin } from '../../store/actions/auth';
import { ThemeContextProvider, RoleContextProvider, FetchServiceProvider } from '../../components/context';

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
    const { email, base } = this.props;
    let fetchService = {};
    if (email !== prevProps.email) {
      if (!email) {
        this.setState({ theme: 'light' });
      }
      if (base === 'firebase') {
        fetchService = new FetchFirebase();
      } else {
        fetchService = new FetchAzure();
      }
      try {
        const members = await fetchService.getAllMember();
        const member = members.find((member) => member.email === email);
        this.setState({ userId: member ? member.userId : '', fetchService });
      } catch ({ message }) {
        this.setState({ onNotification: true, notification: { status: 'error', title: message } });
        setTimeout(() => this.setState({ onNotification: false, notification: {} }), 1000);
      }
    }
  }

  onColorSwitchClickHandler = (color) => {
    let theme = color ? 'dark' : 'light';
    this.setState({ theme });
  };

  onRegisterClickHandler = (directions, title = '', member = []) => {
    this.setState({
      isRegister: !this.state.isRegister,
      directions,
      title,
      curMember: member,
    });
  };

  onCreateTaskClickHandler = (title = '', task = []) => {
    this.setState({
      isTask: !this.state.isTask,
      title,
      curTask: task,
    });
  };

  onTaskClickHandler = (userId, title) => {
    this.setState({
      isMemberTasks: !this.state.isMemberTasks,
      userId,
      title,
    });
  };

  onTrackClickHandler = (userTaskId = '', title = '', subtitle = '', track = {}) => {
    this.setState({
      isTaskTrack: !this.state.isTaskTrack,
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
      isTaskTrack,
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
                  taskId={taskId}
                  isOpen={isTaskTrack}
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
                isOpen={isRegister}
                title={title}
                member={curMember}
                directions={directions}
              />
              <TaskPage
                onCreateTaskClick={this.onCreateTaskClickHandler}
                isOpen={isTask}
                title={title}
                task={curTask}
              />
              <TaskTrackPage
                onTrackClick={this.onTrackClickHandler}
                isOpen={isTaskTrack}
                track={track}
                title={title}
                taskId={taskId}
                userTaskId={userTaskId}
                subtitle={subtitle}
              />
            </ThemeContextProvider>
          </RoleContextProvider>
        </FetchServiceProvider>
        {onNotification && <DisplayNotification notification={notification} />}
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: !!state.auth.token,
    email: state.auth.email,
    base: state.auth.base,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    autoLogin: () => dispatch(autoLogin()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
