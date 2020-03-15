import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../../hoc/layout';
import MembersGrid from '../membersGrid';
import MemberPage from '../../page/memberPage';
import MemberTasksGrid from '../memberTasksGrid';
import TasksGrid from '../tasksGrid';
import TaskPage from '../../page/taskPage';
import Header from '../UI/header';
import Auth from '../auth';

export default class App extends Component {
  state = {
    isRegister: false,
    isTask: false,
    titleMember: '',
    titleTask: '',
    curMember: [],
    curTask: [],
    directions: [],
  };

  onRegisterClickHandler = (directions, title = '', member = []) => {
    this.setState({
      isRegister: !this.state.isRegister,
      titleMember: title,
      curMember: member,
      directions,
    });
  };

  onTaskClickHandler = (title) => {
    this.setState({
      isTask: !this.state.isTask,
      titleTask: title,
    });
  };

  onCreateTaskClickHandler = (title = '', task = []) => {
    this.setState({
      isTask: !this.state.isTask,
      titleTask: title,
      curTask: task,
    });
  };

  render() {
    const { isRegister, isTask, titleMember, titleTask, curMember, curTask, directions } = this.state;
    return (
      <Layout>
        <Header />
        <Auth />
        <Switch>
          <Route path='/' render={() => <h2>Welcome to DIMS</h2>} exact />
          <Route
            path='/MembersGrid'
            render={(props) => (
              <MembersGrid
                {...props}
                onRegisterClick={this.onRegisterClickHandler}
                onTaskClick={this.onTaskClickHandler}
              />
            )}
          />
          <Route
            path='/TasksGrid'
            render={(props) => <TasksGrid {...props} onCreateTaskClick={this.onCreateTaskClickHandler} />}
          />
          <Route path='/MemberTasksGrid' render={(props) => <MemberTasksGrid {...props} title={titleTask} />} />
        </Switch>
        <MemberPage
          onRegisterClick={this.onRegisterClickHandler}
          isOpen={isRegister}
          title={titleMember}
          member={curMember}
          directions={directions}
        />
        <TaskPage onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} title={titleTask} task={curTask} />
      </Layout>
    );
  }
}
