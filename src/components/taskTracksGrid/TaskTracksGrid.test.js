import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import TaskTracksGrid from './TaskTracksGrid';
import { SetUp } from '../helpersComponents';

configure({
  adapter: new Adapter(),
});

describe('<TaskTracksGrid/>', () => {
  let wrapper;

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    const contextRoleValue = '123@mail.ru';
    const contextFetchService = {};
    const props = {
      taskId: '1',
      isOpen: false,
      onTrackClick() {},
    };
    wrapper = mount(
      <MemoryRouter>
        <SetUp
          fetchServiceValue={contextFetchService}
          roleValue={contextRoleValue}
          ThemeValue={contextThemeValue}
          component={<TaskTracksGrid {...props} />}
        />
      </MemoryRouter>,
    );
  });

  it('should render spinner at the start', () => {
    expect(wrapper.find('Spinner')).toHaveLength(1);
  });

  it('should render table with 5 table heads', () => {
    wrapper.find('TaskTracksGrid').instance().setState({ loading: false });
    wrapper.update();
    expect(wrapper.find('th')).toHaveLength(5);
  });
});
