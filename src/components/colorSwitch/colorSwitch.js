import React from 'react';
import { ThemeContext } from '../context';
import imgMoon from '../../assets/images/moon.png';
import imgSun from '../../assets/images/sun.png';

const ColorSwitch = ({ theme, onColorSwitchClickHandler }) => {
  const clickSwitch = () => {
    const switchBtn = document.querySelector('.switch-btn');
    const result = switchBtn.classList.toggle('switch-btn__on');
    onColorSwitchClickHandler(result);
  };

  return (
    <div className={`switch-btn ${theme === 'dark' ? 'switch-btn__on' : ''}`} onClick={clickSwitch}>
      <div className='switch-btn--moon'>
        <img src={imgMoon} width='28px' height='28px' alt='img moon' />
      </div>
      <div className='switch-btn--sun'>
        <img src={imgSun} width='28px' height='28px' alt='img sun' />
      </div>
    </div>
  );
};

export default (props) => (
  <ThemeContext.Consumer>
    {({ theme, onColorSwitchClickHandler }) => (
      <ColorSwitch {...props} theme={theme} onColorSwitchClickHandler={onColorSwitchClickHandler} />
    )}
  </ThemeContext.Consumer>
);
