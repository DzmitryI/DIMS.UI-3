import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../../hoc';
import imgMoon from '../../assets/images/moon.png';
import imgSun from '../../assets/images/sun.png';
import ImageComponent from '../imageComponent/ImageComponent';

const ColorSwitch = ({ theme, onColorSwitchClickHandler }) => {
  const switchBtn = useRef(null);
  const clickSwitch = () => {
    const result = switchBtn.current.classList.toggle('switch-btn__on');
    onColorSwitchClickHandler(result);
  };

  return (
    <div className={`switch-btn ${theme === 'dark' && 'switch-btn__on'}`} onClick={clickSwitch} ref={switchBtn}>
      <ImageComponent className='switch-btn--moon' src={imgMoon} width='28px' alt='img moon' />
      <ImageComponent className='switch-btn--sun' src={imgSun} width='28px' alt='img sun' />
    </div>
  );
};

ColorSwitch.propTypes = {
  theme: PropTypes.string.isRequired,
  onColorSwitchClickHandler: PropTypes.func.isRequired,
};

export default withTheme(ColorSwitch);
