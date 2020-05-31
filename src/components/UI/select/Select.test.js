import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Select from './Select';

configure({
  adapter: new Adapter(),
});

describe('<Select />', () => {
  it('render Select element', () => {
    const wrapper = shallow(
      <Select label='Direction' name='direction' id='direction' defaultValue='false' onChange={() => {}} />,
    );
    expect(wrapper.find('.form-group').length).toEqual(1);
    wrapper.setProps({
      options: [
        { name: 'test1', value: 'test1' },
        { name: 'test2', value: 'test2' },
        { name: 'test3', value: 'test3' },
      ],
      name: 'test',
    });
    expect(wrapper.find('option')).toHaveLength(3);
  });
});
