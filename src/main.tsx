import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppProvider } from './context/AppContext';
import { AudioProvider } from './context/AudioContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AudioProvider>
  </React.StrictMode>
);
