import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../../hoc/layout';
import MembersGrid from '../membersGrid';
import MemberPage from '../../page/memberPage';
import MemberTasksGrid from '../memberTasksGrid';
import TasksGrid from '../tasksGrid';
import TaskPage from '../../page/taskPage';
import Header from '../UI/header';
// import Auth from '../auth';
import { Auth } from '../../contexts/AuthContext';

export default class App extends Component {
  state = {
    isRegister: false,
    login: false,
    isTask: false,
    isMemberTasks: false,
    titleMember: '',
    titleTask: '',
    fullName: '',
    curMember: [],
    userId: null,
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

  mainPage = () => {
    return <h2>Welcome to DIMS</h2>;
  };

  render() {
    const {
      login,
      isRegister,
      isTask,
      isMemberTasks,
      titleMember,
      titleTask,
      fullName,
      curMember,
      userId,
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
              <Auth.Consumer>
                {({ role }) => (
                  // role === Rolesl.ADMIN ? .... :
                  <Route
                    path='/MembersGrid'
                    render={() => (
                      <MembersGrid
                        // {...props}
                        onRegisterClick={this.onRegisterClickHandler}
                        onTaskClick={this.onTaskClickHandler}
                        isRegister={isRegister}
                      />
                    )}
                  />
                )}
              </Auth.Consumer>
              <Route
                path='/TasksGrid'
                render={(props) => (
                  <TasksGrid {...props} onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} />
                )}
              />
            </Switch>
          </>
        )}
        <MemberPage
          onRegisterClick={this.onRegisterClickHandler}
          isOpen={isRegister}
          title={titleMember}
          member={curMember}
          directions={directions}
        />
        <TaskPage onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} title={titleTask} task={curTask} />
        <MemberTasksGrid isOpen={isMemberTasks} userId={userId} fullName={fullName} />
      </Layout>
    );
  }
}
