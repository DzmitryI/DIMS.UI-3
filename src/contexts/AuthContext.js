import React, { Component } from 'react';

const Roles = {
  ADMIN: 'Admin',
};

export class Auth extends Component {
  constructor(props) {
    super(props);

    state = {
      role: Roles.ADMIN,
    };
  }

  render() {
    const AuthContext = React.createContext(this.state);

    return <AuthContext>{this.props.children}</AuthContext>;
  }
}
