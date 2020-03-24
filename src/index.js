import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Auth } from './contexts/AuthContext';

import App from './components/app';
// import * as serviceWorker from './serviceWorker';

const app = (
  <Auth.Provider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth.Provider>
);
ReactDOM.render(app, document.getElementById('root'));
