import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DatePicker from './DatePicker';

configure({ adapter: new Adapter() });

describe('<DatePicker />', () => {
  const props = {
    id: '01',
    onChange: () => {},
    label: 'Date',
    disabled: false,
    date: new Date(),
  };

  it('render DatePicker', () => {
    const wrapper = shallow(<DatePicker {...props} />);
    expect(wrapper.find('label')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(1);
  });
});
