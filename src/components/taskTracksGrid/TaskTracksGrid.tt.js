import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TaskTracksGrid from './TaskTracksGrid';
import FetchFirebase from '../../services/fetchFirebase';
import { ThemeContextProvider, RoleContextProvider, FetchServiceProvider } from '../context';
import { MemoryRouter } from 'react-router-dom';

configure({
  adapter: new Adapter(),
});

describe('<TaskTracksGrid/>', () => {
  let wrapper;

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    const contextRoleValue = 'mentor@mail.ru';
    const contextFetchService = new FetchFirebase();
    wrapper = mount(
      <MemoryRouter>
        <FetchServiceProvider value={contextFetchService}>
          <RoleContextProvider value={contextRoleValue}>
            <ThemeContextProvider value={contextThemeValue}>
              <TaskTracksGrid />
            </ThemeContextProvider>
          </RoleContextProvider>
        </FetchServiceProvider>
      </MemoryRouter>,
    );
  });

  it('should render spinner at the start', () => {
    expect(wrapper.find('Spinner')).toHaveLength(1);
  });

  it('should render table with 5 table heads', () => {
    console.log(wrapper.debug());
    wrapper.find('TaskTracksGrid').instance().setState({ loading: false });
    wrapper.update();
    expect(wrapper.find('th')).toHaveLength(5);
  });
});
