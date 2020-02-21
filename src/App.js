import React, { Component } from 'react';
import Layout from './hoc/layout';
import MembersGrid from './components/membersGrid';
import MemberPage from './components/memberPage';

export default class App extends Component {
  state = {
    isRegister: true,
  };

  onRegisterClickHandler = () => {
    this.setState({ isRegister: !this.state.isRegister });
  };

  render() {
    return (
      <Layout>
        {this.state.isRegister ? (
          <MembersGrid onRegisterClick={this.onRegisterClickHandler} />
        ) : (
          <MemberPage onRegisterClick={this.onRegisterClickHandler} />
        )}
      </Layout>
    );
  }
}
