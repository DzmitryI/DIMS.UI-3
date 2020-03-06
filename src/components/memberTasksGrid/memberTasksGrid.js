import React, { Component } from 'react';
import Button from '../UI/button';

export default class MemberTasksGrid extends Component {
  render() {
    const { isOpen, title } = this.props;
    const cls = ['tasks-wrap'];
    if (!isOpen) {
      cls.push('close');
    }
    return (
      <div className={cls.join(' ')}>
        <h1>Member's Tasks Manage Grid</h1>
        <table border='1'>
          <caption>{`Hi, dear ${title}! This is your current tasks:`}</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Start</th>
              <th>Deadline</th>
              <th>Status</th>
              <th></th>
              <th>(Available only for Admin)</th>
            </tr>
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
                <Button className='btn btn-delete' name='Fail' />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
