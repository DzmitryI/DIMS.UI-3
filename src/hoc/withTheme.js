import React from 'react';
import { ThemeContextConsumer } from '../components/context';

const withTheme = (Wrapped) => (props) => (
  <ThemeContextConsumer>
    {({ theme, onColorSwitchClickHandler }) => (
      <Wrapped {...props} theme={theme} onColorSwitchClickHandler={onColorSwitchClickHandler} />
    )}
  </ThemeContextConsumer>
);

export default withTheme;
