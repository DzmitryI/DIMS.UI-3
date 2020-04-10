import React from 'react';
import Footer from '../footer';

import humanImg from '../../../assets/images/human.png';

const Main = () => {
  return (
    <>
      <h2>Welcome to DIMS</h2>
      <div className='dims__inner'>
        <div className='dims'>
          <img src={humanImg} alt='human' />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Main;
