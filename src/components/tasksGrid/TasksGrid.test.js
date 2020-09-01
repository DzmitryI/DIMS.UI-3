import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Spinner from '../spinner';
import TasksGrid from './TasksGrid';
import FetchFirebase from '../../services/fetchFirebase';
import { ThemeContextProvider, FetchServiceProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<TasksGrid />', () => {
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
    const contextThemeValue = { theme: 'dark' };
    const contextFetchService = new FetchFirebase();
    const props = {
      isTask: true,
      onCreateTaskClick() {},
      statusPageTask() {},
    };
    wrapper = mount(
      <Provider store={store}>
        <ThemeContextProvider value={contextThemeValue}>
          <FetchServiceProvider value={contextFetchService}>
            <TasksGrid {...props} />
          </FetchServiceProvider>
        </ThemeContextProvider>
      </Provider>,
    );
  });

  it('should render spinner at the start', () => {
    // console.log(wrapper.debug());
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });

  it('should render table with 5 table heads', () => {
    wrapper.find('TasksGrid').instance().setState({ loading: false });
    wrapper.update();
    expect(wrapper.find('th')).toHaveLength(5);
  });
});
