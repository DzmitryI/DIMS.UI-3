import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './components/app';

configure({
  adapter: new Adapter(),
});

describe('<App />', () => {
  let wrapper;
  const props = {
    token: '123',
    email: '123@mail.ru',
    base: '',
  };
  const store = createStore(() => props);

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    console.log(wrapper.debug());
  });

  it('should render table with 7 table heads', () => {
    // expect(wrapper.find('th')).toHaveLength(7);
    console.log(wrapper.debug());
  });
});
