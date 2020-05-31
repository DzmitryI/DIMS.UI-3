import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Footer from './Footer';
import { ThemeContextProvider } from '../../context';

configure({
  adapter: new Adapter(),
});

describe('<Footer/>', () => {
  const themeContextValue = { theme: 'dark' };
  it('render Footer component', () => {
    const wrapper = mount(
      <ThemeContextProvider value={themeContextValue}>
        <Footer />
      </ThemeContextProvider>,
    );
    expect(wrapper.find('span')).toHaveLength(1);
  });
});
