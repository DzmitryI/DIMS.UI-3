import React, { Component } from 'react';
import Layout from './hoc/layout';
import MembersGrid from './components/membersGrid';
import MemberPage from './components/memberPage';

export default class App extends Component {
  state = {
    isRegister: false,
  };

  onRegisterClickHandler = () => {
    this.setState({ isRegister: !this.state.isRegister });
  };

  render() {
    return (
      <Layout>
        <MembersGrid onRegisterClick={this.onRegisterClickHandler} />
        <MemberPage onRegisterClick={this.onRegisterClickHandler} isOpen={this.state.isRegister} />
      </Layout>
    );
  }
}
