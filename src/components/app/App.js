import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../../hoc/layout';
import MembersGrid from '../membersGrid';
import MemberTasksGrid from '../memberTasksGrid';
import MemberProgressGrid from '../memberProgressGrid';
import TasksGrid from '../tasksGrid';
import TaskTracksGrid from '../taskTracksGrid';
import MemberPage from '../../page/memberPage';
import TaskPage from '../../page/taskPage';
import TaskTrackPage from '../../page/taskTrackPage';
import Header from '../UI/header';
import Auth from '../auth';
import FetchService from '../../services/fetch-service';

const fetchService = new FetchService();

export default class App extends Component {
  state = {
    isAuthenticated: false,
    token: null,
    email: '',
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
    taskId: null,
    userTaskId: null,
    directions: [],
  };

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!token) {
      this.logout();
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        this.logout();
      } else {
        this.authSuccess(token, email);
        this.autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000);
      }
      const members = await fetchService.getAllMember();
      const [member] = members.filter((member) => member.values.email === email);
      this.setState({ userId: member.userId, title: member.values.name });
    }
  }

  onLoginHandler = (data) => {
    if (data.registered) {
      console.log(data);
      this.setState({ isAuthenticated: !!this.state.token });
    }
  };

  authSuccess = (token, email) => {
    this.setState({ isAuthenticated: !!token, token, email });
  };

  autoLogout = (time) => {
    setTimeout(() => {
      this.logout();
    }, time * 1000);
  };

  logout = () => {
    this.setState({ isAuthenticated: false, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('email');
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

  mainPage = () => {
    return <h2>Welcome to DIMS</h2>;
  };

  render() {
    const {
      isAuthenticated,
      email,
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
    } = this.state;

    let routes = (
      <Switch>
        <Route
          path='/Auth'
          render={(props) => (
            <Auth
              {...props}
              onloginHandler={this.onLoginHandler}
              logout={this.logout}
              authSuccess={this.authSuccess}
              autoLogout={this.autoLogout}
              exact
            />
          )}
        />
        <Redirect to='/Auth' />
      </Switch>
    );

    if (isAuthenticated) {
      routes = (
        <>
          <Header logout={this.logout} email={email} isAuthenticated={isAuthenticated} />
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
                <TasksGrid {...props} onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} />
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
            <Route path='/' render={this.mainPage} exact />
            <Redirect to='/' />
          </Switch>
        </>
      );
    }

    return (
      <Layout>
        {routes}
        <MemberPage
          onRegisterClick={this.onRegisterClickHandler}
          isOpen={isRegister}
          title={title}
          member={curMember}
          directions={directions}
        />
        <TaskPage onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} title={title} task={curTask} />
        <TaskTrackPage
          onTrackClick={this.onTrackClickHandler}
          isOpen={isTaskTrack}
          track={track}
          title={title}
          taskId={taskId}
          userTaskId={userTaskId}
          subtitle={subtitle}
        />
      </Layout>
    );
  }
}
