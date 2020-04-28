import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Spinner from '../spinner';
import TaskTracksGrid from './TaskTracksGrid';
import FetchFirebase from '../../services/fetchFirebase';
import { ThemeContextProvider, RoleContextProvider, FetchServiceProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<TaskTracksGrid/>', () => {
  let wrapper;

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    const contextRoleValue = null;
    const contextFetchService = new FetchFirebase();
    wrapper = mount(
      <FetchServiceProvider value={contextFetchService}>
        <RoleContextProvider value={contextRoleValue}>
          <ThemeContextProvider value={contextThemeValue}>
            <TaskTracksGrid />
          </ThemeContextProvider>
        </RoleContextProvider>
      </FetchServiceProvider>,
    );
  });

  it('should render spinner at the start', () => {
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });

  // it('should render table with 5 table heads', () => {
  //   wrapper.find('TaskTracksGrid').instance().setState({ loading: false });
  //   wrapper.update();
  //   console.log(wrapper.debug());
  //   expect(wrapper.find('th')).toHaveLength(5);
  // });
});
