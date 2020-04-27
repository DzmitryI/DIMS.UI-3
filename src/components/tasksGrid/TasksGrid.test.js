import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TasksGrid from './TasksGrid';
import Cell from '../UI/cell';
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
    wrapper = mount(
      <ThemeContextProvider value={contextThemeValue}>
        <FetchServiceProvider value={contextFetchService}>
          <TasksGrid />
        </FetchServiceProvider>
      </ThemeContextProvider>,
    );
  });

  it('should render 5 tr cells', () => {
    wrapper.setProps({ isOpen: true });
    console.log(wrapper.debug());
    expect(wrapper.find(Cell)).toHaveLength(4);
  });
});
