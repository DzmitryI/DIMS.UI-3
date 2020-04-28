import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Spinner from '../spinner';
import MembersGrid from './MembersGrid';
import { ThemeContextProvider } from '../context';
import { Provider } from 'react-redux';

configure({
  adapter: new Adapter(),
});

describe('<MembersGrid />', () => {
  let wrapper;

  beforeEach(() => {
    store = mockStore({});
    const contextThemeValue = { theme: 'dark' };
    wrapper = mount(
      <Provider>
        <ThemeContextProvider value={contextThemeValue}>
          <MembersGrid />
        </ThemeContextProvider>
      </Provider>,
    );
  });

  it('should render spinner at the start', () => {
    console.log(wrapper.debug());
    expect(wrapper.find('Spinner')).toHaveLength(1);
  });

  //TODO
  // it('should render table with 5 table heads', () => {
  //   wrapper.find('MembersGrid').instance().setState({ loading: false });
  //   wrapper.update();
  //   expect(wrapper.find('th')).toHaveLength(5);
  // });
});
