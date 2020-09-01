import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Registration from './Registration';
import { ThemeContextProvider } from '../context';

configure({ adapter: new Adapter() });

describe('<Registration />', () => {
  let wrapper;

  const props = {
    authData: {
      onNotification: false,
      notification: {},
      isRegistered: false,
    },
  };

  const store = createStore(() => props);

  beforeEach(() => {
    const contextThemeValue = { theme: 'dark' };
    const params = {
      auth() {},
    };

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <ThemeContextProvider value={contextThemeValue}>
            <Registration {...params} />
          </ThemeContextProvider>
        </Router>
      </Provider>,
    );
  });

  it('should render two inputs', () => {
    expect(wrapper.find('input')).toHaveLength(2);
  });
});
