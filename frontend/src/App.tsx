// src/App.tsx
import React from 'react';
import ChatBox from './components/ChatBox';
import { Box, IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface AppProps {
  toggleTheme: () => void;
  darkMode: boolean;
}

const App: React.FC<AppProps> = ({ toggleTheme, darkMode }) => {
  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Tooltip title="Toggle theme">
          <IconButton onClick={toggleTheme}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>
      <ChatBox />
    </Box>
  );
};

export default App;
