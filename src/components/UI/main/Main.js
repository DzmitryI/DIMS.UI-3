import React from 'react';
import Footer from '../footer';
import imgHuman from '../../../assets/images/human.png';
import imgMail from '../../../assets/images/mail.png';
import imgGit from '../../../assets/images/git.png';
import { withTheme } from '../../../hoc';

const Main = ({ theme }) => {
  return (
    <div className='main-page__wrap'>
      <h2>Welcome to DIMS</h2>
      <div className='dims__inner'>
        <div className='dims'>
          <img src={imgHuman} alt='human' />
        </div>
      </div>
      <div className={`dims-develop__wrap dims-develop__wrap--${theme}`}>
        <p>App developed by Ivanov Dmitriy</p>
        <a href='mailto:dmitriy.ivanou@gmail.com' target='_blank'>
          <img src={imgMail} width='32px' alt='mail' />
        </a>
        <a href='https://github.com/DzmitryI' target='_blank'>
          <img src={imgGit} width='32px' alt='git' />
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default withTheme(Main);
