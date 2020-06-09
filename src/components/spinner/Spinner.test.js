import React from 'react';
import { configure, mount } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import Spinner from './Spinner';
import { ThemeContextProvider } from '../context';

configure({ adapter: new Adaptor() });

describe('<Spinner/>', () => {
  it('render Spinner component', () => {
    const contextThemeValue = { theme: 'dark' };
    const wrapper = mount(
      <ThemeContextProvider value={contextThemeValue}>
        <Spinner />
      </ThemeContextProvider>,
    );
    expect(wrapper.find('div')).toHaveLength(4);
  });
});
