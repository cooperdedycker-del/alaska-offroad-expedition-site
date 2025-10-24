import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AlaskaOffroadExpedition from './AlaskaOffroadExpedition';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AlaskaOffroadExpedition />
    </BrowserRouter>
  </React.StrictMode>
);