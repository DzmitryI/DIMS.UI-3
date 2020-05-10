import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import Radio from './Radio';

configure({
  adapter: new Adapter(),
});

describe('<Radio />', () => {
  it('Snapshot Radio element', () => {
    const wrapper = shallow(<Radio />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
