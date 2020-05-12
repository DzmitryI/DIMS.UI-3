import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Spinner from '../spinner';
import TasksGrid from './TasksGrid';
import FetchFirebase from '../../services/fetchFirebase';
import { ThemeContextProvider, FetchServiceProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<TasksGrid />', () => {
  let wrapper;

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    const contextFetchService = new FetchFirebase();
    const props = {
      isTask: true,
      onCreateTaskClick() {},
    };
    wrapper = mount(
      <ThemeContextProvider value={contextThemeValue}>
        <FetchServiceProvider value={contextFetchService}>
          <TasksGrid {...props} />
        </FetchServiceProvider>
      </ThemeContextProvider>,
    );
  });

  it('should render spinner at the start', () => {
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });

  it('should render table with 5 table heads', () => {
    wrapper.find('TasksGrid').instance().setState({ loading: false });
    wrapper.update();
    expect(wrapper.find('th')).toHaveLength(5);
  });
});
