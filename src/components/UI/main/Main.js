import React from 'react';
import Footer from '../footer';
import imgHuman from '../../../assets/images/human.png';
import ImageComponent from '../../imageComponent/ImageComponent';

const Main = () => {
  return (
    <div className='main-page__wrap'>
      <h1>Welcome to DIMS</h1>
      <div className='dims__inner'>
        <ImageComponent className='dims' width='30%' src={imgHuman} alt='human' />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
