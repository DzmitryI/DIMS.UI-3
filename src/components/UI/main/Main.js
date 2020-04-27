import React from 'react';
import Footer from '../footer';
import imgHuman from '../../../assets/images/human.png';

const Main = () => {
  return (
    <div className='main-page__wrap'>
      <h1>Welcome to DIMS</h1>
      <div className='dims__inner'>
        <div className='dims'>
          <img src={imgHuman} alt='human' />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
