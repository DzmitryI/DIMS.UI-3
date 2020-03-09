import React, { Component } from 'react';
import Layout from './hoc/layout';
// import MembersGrid from './components/membersGrid';
// import MemberPage from './page/memberPage';
// import MemberTasksGrid from './components/memberTasksGrid';
import TasksGrid from './components/tasksGrid';
import TaskPage from './page/taskPage';
import Header from './components/UI/header';

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
    // const { isRegister, titleMember, titleTask, curMember, isTask, directions } = this.state;
    const { titleTask, curTask, isTask } = this.state;
    return (
      <Layout>
        <Header />
        {/* <MembersGrid
          onRegisterClick={this.onRegisterClickHandler}
          onTaskClick={this.onTaskClickHandler}
          isOpen={isTask}
        />
        <MemberPage
          onRegisterClick={this.onRegisterClickHandler}
          isOpen={isRegister}
          title={titleMember}
          member={curMember}
          directions={directions}
        />
        <MemberTasksGrid isOpen={isTask} title={titleTask} /> */}
        <TasksGrid onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} />
        <TaskPage onCreateTaskClick={this.onCreateTaskClickHandler} isOpen={isTask} title={titleTask} task={curTask} />
      </Layout>
    );
  }
}
