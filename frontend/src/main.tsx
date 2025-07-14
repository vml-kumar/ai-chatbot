// src/main.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';

const Main = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <App toggleTheme={() => setDarkMode(!darkMode)} darkMode={darkMode} />
      </ThemeProvider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
