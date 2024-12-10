import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, login, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const csrfToken = Cookies.get('XSRF-TOKEN');
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'XSRF-TOKEN': csrfToken || ''
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
      <Typography variant="body2" align="center">
        Don't have an account?{' '}
        <Link href="/register" passHref>
          <Button variant="text" color="primary">
            Register
          </Button>
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
