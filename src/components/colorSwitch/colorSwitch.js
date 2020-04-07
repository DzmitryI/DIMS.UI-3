import React from 'react';
import { ThemeContext } from '../context';
import imgMoon from '../../assets/images/moon.png';
import imgSun from '../../assets/images/sun.png';

const ColorSwitch = ({ onColorSwitchClickHandler }) => {
  const clickSwitch = () => {
    const switchBtn = document.querySelector('.switch-btn');
    const result = switchBtn.classList.toggle('switch-btn__on');
    onColorSwitchClickHandler(result);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div className={`switch-btn ${theme === 'dark' ? 'switch-btn__on' : ''}`} onClick={clickSwitch}>
          <div className='switch-btn--moon'>
            <img src={imgMoon} width='28px' height='28px' alt='img moon' />
          </div>
          <div className='switch-btn--sun'>
            <img src={imgSun} width='28px' height='28px' alt='img sun' />
          </div>
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default ColorSwitch;
