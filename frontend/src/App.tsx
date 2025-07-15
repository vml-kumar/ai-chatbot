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
  useMediaQuery,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { auth } from './firebase/firebase';
import { clearUser } from './redux/slices/authSlice';
import { resetChat } from './redux/slices/chatSlice';
import { useTheme } from '@mui/material/styles';

interface AppProps {
  toggleTheme: () => void;
  darkMode: boolean;
}

const App: React.FC<AppProps> = ({ toggleTheme, darkMode }) => {
  const user = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(clearUser());
    dispatch(resetChat());
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const isLoggedIn = !!user.uid;

  return (
    <>
      {/* Top Header */}
      <AppBar position="fixed" color="default" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <img src={logo} alt="Logo" style={{ height: 40 }} />
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
            justifyContent="flex-end"
            sx={{ maxWidth: '100%' }}
          >
            <Tooltip title="Toggle theme">
              <IconButton onClick={toggleTheme}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {isLoggedIn ? (
              <>
                <Tooltip title={user.email}>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: { xs: 120, sm: 200 },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.email}
                  </Typography>
                </Tooltip>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleLogout}
                  sx={{ textTransform: 'none' }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleLoginRedirect}
                sx={{ textTransform: 'none' }}
              >
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
