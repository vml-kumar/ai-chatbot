import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { auth } from '@/firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/authSlice';

const AuthPage = () => {
  const dispatch = useAppDispatch();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      if (isSignup) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        dispatch(setUser({ email: userCred.user.email, uid: userCred.user.uid }));
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        dispatch(setUser({ email: userCred.user.email, uid: userCred.user.uid }));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isSignup ? 'Create Account' : 'Login'}
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button variant="contained" onClick={handleSubmit}>
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>
          <Button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
