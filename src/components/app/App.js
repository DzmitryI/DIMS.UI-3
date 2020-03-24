import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../../hoc/layout';
import MembersGrid from '../membersGrid';
import MemberTasksGrid from '../memberTasksGrid';
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
    titleMember: '',
    titleTask: '',
    fullName: '',
    curMember: [],
    userId: null,
    userTaskId: null,
    curTask: [],
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
      titleMember: title,
      curMember: member,
      directions,
    });
  };

  onCreateTaskClickHandler = (title = '', task = []) => {
    this.setState({
      isTask: !this.state.isTask,
      titleTask: title,
      curTask: task,
    });
  };

  onTaskClickHandler = (userId, fullName) => {
    this.setState({
      isMemberTasks: !this.state.isMemberTasks,
      userId,
      fullName,
    });
  };

  onTrackClickHandler = (userTaskId, titleTask, title = '') => {
    this.setState({
      isTaskTrack: !this.state.isTaskTrack,
      userTaskId,
      titleTask,
      titleTaskTrack: title,
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
      isMemberTasks,
      isTaskTrack,
      titleMember,
      titleTask,
      titleTaskTrack,
      fullName,
      curMember,
      userId,
      userTaskId,
      curTask,
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
            </Switch>
          </>
        )}
        <MemberTasksGrid
          isOpen={isMemberTasks}
          userId={userId}
          fullName={fullName}
          onTrackClick={this.onTrackClickHandler}
        />
        <MemberPage
          onRegisterClick={this.onRegisterClickHandler}
          isOpen={isRegister}
          title={titleMember}
          member={curMember}
          directions={directions}
        />
        <TaskPage onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} title={titleTask} task={curTask} />
        <TaskTrackPage
          onTrackClick={this.onTrackClickHandler}
          isOpen={isTaskTrack}
          userTaskId={userTaskId}
          // userId={userId}
          titleTask={titleTask}
          titleTaskTrack={titleTaskTrack}
          // member={curMember}
        />
      </Layout>
    );
  }
}
