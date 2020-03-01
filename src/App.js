import React, { Component } from 'react';
import Layout from './hoc/layout';
import MembersGrid from './components/membersGrid';
import MemberPage from './page/memberPage';

export default class App extends Component {
  state = {
    isRegister: false,
    titleMember: '',
    curMember: [],
  };

  onRegisterClickHandler = (member, title) => {
    this.setState({
      isRegister: !this.state.isRegister,
      titleMember: title,
      curMember: member,
    });
  };

  render() {
    const { isRegister, titleMember, curMember } = this.state;
    return (
      <Layout>
        <MembersGrid onRegisterClick={this.onRegisterClickHandler} />
        <MemberPage
          onRegisterClick={this.onRegisterClickHandler}
          isOpen={isRegister}
          title={titleMember}
          member={curMember}
        />
      </Layout>
    );
  }
}
