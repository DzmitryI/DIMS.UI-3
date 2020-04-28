import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import Input from './Input';

configure({
  adapter: new Adapter(),
});

describe('<Input/>', () => {
  it('render Input element', () => {
    const wrapper = shallow(<Input />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
