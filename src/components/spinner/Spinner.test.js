import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import Spinner from './Spinner';
import { ThemeContextProvider } from '../context';

configure({
  adapter: new Adaptor(),
});

describe('<Spinner/>', () => {
  it('Snapshot Spinner component', () => {
    const contextThemeValue = { theme: 'dark' };
    const wrapper = mount(
      <ThemeContextProvider value={contextThemeValue}>
        <Spinner />
      </ThemeContextProvider>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
