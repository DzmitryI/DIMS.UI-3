import React from 'react';
import { ThemeContextConsumer } from '../components/context';

const withTheme = (Wrapped) => {
  return (props) => {
    return (
      <ThemeContextConsumer>
        {({ theme, onColorSwitchClickHandler }) => (
          <Wrapped {...props} theme={theme} onColorSwitchClickHandler={onColorSwitchClickHandler} />
        )}
      </ThemeContextConsumer>
    );
  };
};

export default withTheme;
