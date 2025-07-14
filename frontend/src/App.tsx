import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import AuthPage from './pages/AuthPage';
import logo from './assets/ai-chatbot-logo-1.png';
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Box,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { auth } from './firebase/firebase';
import { clearUser } from './redux/slices/authSlice';

interface AppProps {
  toggleTheme: () => void;
  darkMode: boolean;
}

const App: React.FC<AppProps> = ({ toggleTheme, darkMode }) => {
  const user = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(clearUser());
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const isLoggedIn = !!user.uid;

  return (
    <>
      {/* Fixed Top Header */}
      <AppBar position="fixed" color="default" elevation={2}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" fontWeight={600}>
              <img src={logo} alt="Logo" style={{ height: 40 }} />
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
              <Tooltip title="Toggle theme">
                <IconButton onClick={toggleTheme}>
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            {isLoggedIn ? (
              <>
                <Typography variant="body2">{user.email}</Typography>
                <Button variant="outlined" color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleLoginRedirect}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Push content below header */}
      <Box sx={{ mt: 10 }}>
        <Routes>
          <Route path="/" element={<ChatBox />} />
          <Route
            path="/auth"
            element={isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />}
          />
        </Routes>
      </Box>
    </>
  );
};

export default App;