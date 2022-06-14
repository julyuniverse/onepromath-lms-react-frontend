import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    {/* <React.StrictMode> useEffect()가 두 번 실행 방지*/}
      <App />
    {/* </React.StrictMode> */}
  </BrowserRouter>,
  document.getElementById('root')
);
