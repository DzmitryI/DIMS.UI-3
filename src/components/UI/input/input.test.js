import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import Input from './Input';

configure({
  adapter: new Adapter(),
});

describe('<Input />', () => {
  it('Snapshot Input element', () => {
    // const wrapper = shallow(
    //   <Input
    //     id='email'
    //     label='Email'
    //     touched
    //     shouldValidation
    //     onChange={() => {}}
    //     value='email@mail.ru'
    //     onBlur={() => {}}
    //     onFocus={() => {}}
    //     valid='true'
    //     errorMessage='enter correct email'
    //   />,
    // );
    // expect(toJson(wrapper)).toMatchSnapshot();
  });
});
