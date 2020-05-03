import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MemberProgressGrid from './MemberProgressGrid';
import { ThemeContextProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<MemberProgressGrid/>', () => {
  let wrapper;

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    wrapper = mount(
      <ThemeContextProvider value={contextThemeValue}>
        <MemberProgressGrid />
      </ThemeContextProvider>,
    );
  });

  it('should render spinner at the start', () => {
    expect(wrapper.find('Spinner')).toHaveLength(1);
  });
});
