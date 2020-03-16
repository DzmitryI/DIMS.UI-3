import React, { Component } from 'react';
import Button from '../UI/button';
import HeaderTable from '../UI/headerTable';
import { headerMemberTasksGrid } from '../helpersComponents';

export default class MemberTasksGrid extends Component {
  render() {
    const { isOpen, title } = this.props;
    return (
      <div className={`tasks-wrap ${isOpen ? 'close' : ''}`}>
        <h1>Member's Tasks Manage Grid</h1>
        <table border='1'>
          <caption>{`Hi, dear ${title}! This is your current tasks:`}</caption>
          <thead>
            <HeaderTable arr={headerMemberTasksGrid} />
          </thead>
          <tbody>
            <tr>
              <td className='td'>{1}</td>
              <td className='td'>
                <span onClick={this.onChangeClick}>{`Task`}</span>
              </td>
              <td className='td'>{`1`}</td>
              <td className='td'>{`2`}</td>
              <td className='td'>{`Sucess`}</td>
              <td className='td'>
                <Button className='btn btn-progress' name='Track' />
              </td>
              <td className='td'>
                <Button className='btn btn-success' name='Success' />
                <Button className='btn btn-fail' name='Fail' />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
