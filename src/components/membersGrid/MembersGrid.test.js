import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MembersGrid from './MembersGrid';
import { ThemeContextProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<MembersGrid />', () => {
  let wrapper;
  const props = {
    members: [],
    directions: [],
  };
  const store = createStore(() => props);

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    wrapper = mount(
      <Provider store={store}>
        <ThemeContextProvider value={contextThemeValue}>
          <MembersGrid />
        </ThemeContextProvider>
      </Provider>,
    );
  });

  it('should render table with 7 table heads', () => {
    expect(wrapper.find('th')).toHaveLength(7);
  });
});
