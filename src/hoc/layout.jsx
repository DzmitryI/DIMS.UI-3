import React, { Component } from 'react';

export default class Layout extends Component {
  render() {
    return (
      <div>
        <main>{this.props.children}</main>
      </div>
    );
  }
}
