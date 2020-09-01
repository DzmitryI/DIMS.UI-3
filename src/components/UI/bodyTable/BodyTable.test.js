import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import BodyTable from './BodyTable';

configure({ adapter: new Adapter() });

describe('<BodyTable />', () => {
  const arr = [
    [
      { className: 'green', value: '✔️' },
      { className: 'green', value: '✔️' },
      { className: 'red', value: '❌' },
    ],
    [
      { className: 'green', value: '✔️' },
      { className: 'red', value: '❌' },
      { className: 'red', value: '❌' },
    ],
  ];
  it('render Body table component', () => {
    const wrapper = mount(
      <table>
        <tbody>
          <BodyTable arr={arr} />
        </tbody>
      </table>,
    );
    expect(wrapper.find('td')).toHaveLength(6);
    expect(wrapper.find('tr')).toHaveLength(2);
  });
});
