import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MembersGrid from './MembersGrid';
import { ThemeContextProvider } from '../context';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

configure({
  adapter: new Adapter(),
});

describe('<MembersGrid />', () => {
  let wrapper;
  const store = createStore(() => ({}));

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    wrapper = mount(
      <Provider store={store}>
        <ThemeContextProvider value={contextThemeValue}>
          <MembersGrid />
        </ThemeContextProvider>
      </Provider>,
    );
  });

  it('should render spinner at the start', () => {
    // expect(wrapper.find('Spinner')).toHaveLength(1);
    console.log(wrapper.debug());
  });

  // it('should render table with 5 table heads', () => {
  //   wrapper.find('MembersGrid').instance().setState({ loading: false });
  //   wrapper.update();
  //   expect(wrapper.find('th')).toHaveLength(5);
  // });
});
