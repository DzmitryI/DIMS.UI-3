import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ColorSwitch from './ColorSwitch';
import { ThemeContextProvider } from '../context';

configure({
  adapter: new Adapter(),
});

describe('<ColorSwitch />', () => {
  let wrapper;
  beforeEach(() => {
    const contextThemeValue = { theme: 'dark', onColorSwitchClickHandler() {} };
    wrapper = mount(
      <ThemeContextProvider value={contextThemeValue}>
        <ColorSwitch />
      </ThemeContextProvider>,
    );
  });
  it('should render 3 div elements ', () => {
    expect(wrapper.find('div')).toHaveLength(3);
  });
  it('should render element with className: switch-btn__on', () => {
    expect(wrapper.find('.switch-btn__on')).toHaveLength(1);
  });
});
