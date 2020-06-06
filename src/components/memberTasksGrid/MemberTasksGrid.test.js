import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MemberTasksGrid from './MemberTasksGrid';
import { ThemeContextProvider, RoleContextProvider, FetchServiceProvider } from '../context';

configure({ adapter: new Adapter() });

describe('<MemberTasksGrid />', () => {
  let wrapper;

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    const contextRoleValue = 'email@mail.ru';
    const contextFetchServiceValue = {};
    const params = {
      userId: '01',
      title: 'Member grid',
      onTrackClick() {},
      onOpenTaskTracksClick() {},
      fetchMembers() {},
    };

    wrapper = mount(
      <RoleContextProvider value={contextRoleValue}>
        <ThemeContextProvider value={contextThemeValue}>
          <FetchServiceProvider value={contextFetchServiceValue}>
            <MemberTasksGrid {...params} />
          </FetchServiceProvider>
        </ThemeContextProvider>
      </RoleContextProvider>,
    );
    console.log(wrapper.debug());
  });

  it('should render spinner at the start', () => {
    expect(wrapper.find('Spinner')).toHaveLength(1);
  });

  it('should render table with 7 table heads', () => {
    wrapper.find('MemberTasksGrid').instance().setState({ loading: false });
    wrapper.update();
    expect(wrapper.find('th')).toHaveLength(7);
  });
});
