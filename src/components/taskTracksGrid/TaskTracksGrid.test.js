import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import TaskTracksGrid from './TaskTracksGrid';
import { FetchServiceProvider, ThemeContextProvider, RoleContextProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<TaskTracksGrid/>', () => {
  let wrapper;

  const props = {
    tasks: [],
    loading: true,
    onNotification: false,
    notification: {},
    error: false,
    errorMessage: '',
  };

  const store = createStore(() => props);

  beforeEach(() => {
    const contextThemeValue = 'dark';
    const contextRoleValue = '123@mail.ru';
    const contextFetchService = {};
    const props = {
      // taskId: '1',
      // isOpen: false,
      // onTrackClick() {},
      // statusPageTrack() {},
      // isTrackPageOpen: false,
    };
    wrapper = mount(
      <Provider store={store}>
        <RoleContextProvider value={contextRoleValue}>
          <ThemeContextProvider value={contextThemeValue}>
            <FetchServiceProvider value={contextFetchService}>
              <TaskTracksGrid {...props} />
            </FetchServiceProvider>
          </ThemeContextProvider>
        </RoleContextProvider>
      </Provider>,
    );
  });

  it('should render spinner at the start', () => {
    // console.log(wrapper.debug());
    expect(wrapper.find('Spinner')).toHaveLength(1);
  });

  it('should render table with 5 table heads', () => {
    // console.log(wrapper.debug());
    wrapper.find('TaskTracksGrid').instance().setState({ loading: false });
    wrapper.update();
    expect(wrapper.find('th')).toHaveLength(5);
  });
});
