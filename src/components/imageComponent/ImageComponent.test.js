import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ImageComponent from './ImageComponent';

configure({ adapter: new Adapter() });

describe('<ImageComponent />', () => {
  it('render Image component', () => {
    const wrapper = shallow(<ImageComponent className='img' src='' />);
    expect(wrapper.find('img')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(1);
  });
});
