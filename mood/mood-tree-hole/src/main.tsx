import React from 'react';
import * as ReactDOM from 'react-dom';
import { MoodProvider } from '@/context/MoodContext';
import { SmallHappyProvider } from '@/context/SmallHappyContext';
import App from './App';
import './styles/globals.css';

ReactDOM.render(
  <React.StrictMode>
    <MoodProvider>
      <SmallHappyProvider>
        <App />
      </SmallHappyProvider>
    </MoodProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
