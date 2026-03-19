import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { I18nProvider } from './providers/I18nProvider.jsx';
import { AuthProvider } from './providers/AuthProvider.jsx';
import { SettingsProvider } from './providers/SettingsProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <I18nProvider>
            <App />
          </I18nProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
