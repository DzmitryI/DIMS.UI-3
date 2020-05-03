import React, { useRef } from 'react';
import { withTheme } from '../../hoc';
import imgMoon from '../../assets/images/moon.png';
import imgSun from '../../assets/images/sun.png';
import PropTypes from 'prop-types';

const ColorSwitch = ({ theme, onColorSwitchClickHandler }) => {
  const switchBtn = useRef(null);
  const clickSwitch = () => {
    const result = switchBtn.current.classList.toggle('switch-btn__on');
    onColorSwitchClickHandler(result);
  };

  return (
    <div className={`switch-btn ${theme === 'dark' && 'switch-btn__on'}`} onClick={clickSwitch} ref={switchBtn}>
      <div className='switch-btn--moon'>
        <img src={imgMoon} width='28px' alt='img moon' />
      </div>
      <div className='switch-btn--sun'>
        <img src={imgSun} width='28px' alt='img sun' />
      </div>
    </div>
  );
};

ColorSwitch.propTypes = {
  theme: PropTypes.string,
  onColorSwitchClickHandler: PropTypes.func,
};

export default withTheme(ColorSwitch);
