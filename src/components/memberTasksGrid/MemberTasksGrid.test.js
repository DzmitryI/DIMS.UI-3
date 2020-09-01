import React from 'react';
import { configure, shallow } from 'enzyme';
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

    wrapper = shallow(
      <RoleContextProvider value={contextRoleValue}>
        <ThemeContextProvider value={contextThemeValue}>
          <FetchServiceProvider value={contextFetchServiceValue}>
            <MemberTasksGrid {...params} />
          </FetchServiceProvider>
        </ThemeContextProvider>
      </RoleContextProvider>,
    );
  });

  it('should render spinner at the start', () => {
    expect(wrapper.find('Spinner')).toHaveLength(0);
  });
});
