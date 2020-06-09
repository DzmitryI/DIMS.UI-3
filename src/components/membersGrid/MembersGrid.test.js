import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MembersGrid from './MembersGrid';
import { ThemeContextProvider, RoleContextProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<MembersGrid />', () => {
  let wrapper;

  const props = {
    members: {
      members: [],
      directions: [],
      loading: false,
      onNotification: false,
      errorMessage: '',
      error: false,
      notification: {},
    },
  };

  const store = createStore(() => props);

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    const contextRoleValue = 'email@mail.ru';
    const params = {
      isRegister: true,
      onRegisterClick() {},
      onTaskClick() {},
      onProgressClick() {},
      fetchMembersDelete() {},
      fetchMembers() {},
    };
    wrapper = mount(
      <Provider store={store}>
        <RoleContextProvider value={contextRoleValue}>
          <ThemeContextProvider value={contextThemeValue}>
            <MembersGrid {...params} />
          </ThemeContextProvider>
        </RoleContextProvider>
      </Provider>,
    );
  });

  it('should render table with 7 table heads', () => {
    expect(wrapper.find('th')).toHaveLength(7);
  });
});
