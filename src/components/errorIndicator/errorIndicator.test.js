import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ErrorIndicator from './ErrorIndicator';

configure({ adapter: new Adapter() });

describe('<ErrorIndicator />', () => {
  it('render error indicator', () => {
    const wrapper = shallow(<ErrorIndicator errorMessage='error' />);
    expect(wrapper.find('span')).toHaveLength(2);
    expect(wrapper.find('div')).toHaveLength(1);
  });
});
