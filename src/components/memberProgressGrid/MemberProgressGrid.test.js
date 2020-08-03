import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MemberProgressGrid from './MemberProgressGrid';
import { ThemeContextProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<MemberProgressGrid/>', () => {
  let wrapper;

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    const props = {
      userId: '1',
      title: 'test',
      onTaskClick() {},
      statusPageTask() {},
    };
    wrapper = shallow(
      <ThemeContextProvider value={contextThemeValue}>
        <MemberProgressGrid {...props} />
      </ThemeContextProvider>,
    );
  });

  it('should render spinner at the start', () => {
    expect(wrapper.find('Spinner')).toHaveLength(0);
  });
});
