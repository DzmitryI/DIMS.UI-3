import React, { Component } from 'react';
import Layout from './hoc/layout';
import MembersGrid from './components/membersGrid';
import MemberPage from './page/memberPage';
import MemberTasksGrid from './components/memberTasksGrid';

export default class App extends Component {
  state = {
    isRegister: false,
    isTask: false,
    titleMember: '',
    titleTask: '',
    curMember: [],
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

  render() {
    const { isRegister, titleMember, titleTask, curMember, isTask, directions } = this.state;
    return (
      <Layout>
        <MembersGrid
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
        <MemberTasksGrid isOpen={isTask} title={titleTask} />
      </Layout>
    );
  }
}
