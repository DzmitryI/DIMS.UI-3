import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../../hoc/layout';
import MembersGrid from '../membersGrid';
import MemberTasksGrid from '../memberTasksGrid';
import MemberProgressGrid from '../memberProgressGrid';
import TasksGrid from '../tasksGrid';
import MemberPage from '../../page/memberPage';
import TaskPage from '../../page/taskPage';
import TaskTrackPage from '../../page/taskTrackPage';
import Header from '../UI/header';
import Auth from '../auth';

export default class App extends Component {
  state = {
    login: false,
    isRegister: false,
    isTask: false,
    isMemberTasks: false,
    isTaskTrack: false,
    title: '',
    subtitle: '',
    curMember: [],
    curTask: [],
    userId: null,
    userTaskId: null,
    directions: [],
  };

  onLoginHandler = (data) => {
    if (data.registered) {
      this.setState({ login: !this.state.login });
    }
  };

  onRegisterClickHandler = (directions, title = '', member = []) => {
    this.setState({
      isRegister: !this.state.isRegister,
      title,
      curMember: member,
      directions,
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

  onTrackClickHandler = (userTaskId, title = '', subtitle) => {
    this.setState({
      isTaskTrack: !this.state.isTaskTrack,
      userTaskId,
      title,
      subtitle,
    });
  };

  onProgressClickHandler = (userId, title) => {
    this.setState({
      userId,
      title,
    });
  };

  mainPage = () => {
    return <h2>Welcome to DIMS</h2>;
  };

  render() {
    const {
      login,
      isRegister,
      isTask,
      isTaskTrack,
      title,
      subtitle,
      curMember,
      curTask,
      userId,
      userTaskId,
      directions,
    } = this.state;
    return (
      <Layout>
        {login ? (
          <Auth onloginHandler={this.onLoginHandler} />
        ) : (
          <>
            <Header />
            <Switch>
              <Route path='/' render={this.mainPage} exact />
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
              />
              <Route
                path='/TasksGrid'
                render={(props) => (
                  <TasksGrid {...props} onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} />
                )}
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
                  <MemberTasksGrid {...props} userId={userId} title={title} onTrackClick={this.onTrackClickHandler} />
                )}
              />
            </Switch>
          </>
        )}
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
          userTaskId={userTaskId}
          title={title}
          subtitle={subtitle}
        />
      </Layout>
    );
  }
}
