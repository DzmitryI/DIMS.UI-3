import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HeaderTable from './HeaderTable';

configure({
  adapter: new Adapter(),
});

describe('<HeaderTable />', () => {
  it('render Table header element', () => {
    const wrapper = shallow(<HeaderTable />);
    wrapper.setProps({ arr: ['', 'Task', 'Note', 'Date', ''] });
    expect(wrapper.find('th')).toHaveLength(5);
  });
});
