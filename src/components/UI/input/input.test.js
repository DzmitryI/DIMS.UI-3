import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Input from './Input';

configure({
  adapter: new Adapter(),
});

describe('<Input />', () => {
  it('Snapshot Input element', () => {
    const wrapper = mount(
      <Input
        id='email'
        label='Email'
        touched
        shouldValidation
        onChange={() => {}}
        value='email@mail.ru'
        onBlur={() => {}}
        onFocus={() => {}}
        valid='true'
        errorMessage='enter correct email'
      />,
    );
    expect(wrapper.find('label')).toHaveLength(1);
    expect(wrapper.find('div')).toHaveLength(1);
  });
});
