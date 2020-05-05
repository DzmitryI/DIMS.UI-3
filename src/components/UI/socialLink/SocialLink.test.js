import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SocialLink from './SocialLink';

configure({
  adapter: new Adapter(),
});

describe('<SocialLink/>', () => {
  it('render SocialLink component', () => {
    const wrapper = shallow(<SocialLink />);
    expect(wrapper.find('a')).toHaveLength(1);
  });
});
