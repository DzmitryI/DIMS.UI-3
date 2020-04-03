import React from 'react';
import imgMoon from '../../assets/images/moon.png';
import imgSun from '../../assets/images/sun.png';

const colorSwitch = (props) => {
  const clickSwitch = () => {
    const switchBtn = document.querySelector('.switch-btn');
    const result = switchBtn.classList.toggle('switch-btn__on');
    props.onColorSwitchClickHandler(result);
  };

  const { theme } = props;
  return (
    <div className={`switch-btn ${theme === 'dark' ? 'switch-btn__on' : ''}`} onClick={clickSwitch}>
      <div className='switch-btn--moon'>
        <img src={imgMoon} width='28px' height='28px' />
      </div>
      <div className='switch-btn--sun'>
        <img src={imgSun} width='28px' height='28px' />
      </div>
    </div>
  );
};

export default colorSwitch;
