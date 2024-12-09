import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      });

      if (response.ok) {
        const { token, user } = await response.json();
        login({ id: user.id, fullName: user.fullName }, token); // Update context state
        router.push('/dashboard');
      } else {
        const { message } = await response.json();
        setError(message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;