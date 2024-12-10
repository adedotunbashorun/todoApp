import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import Link from 'next/link';
import Cookies from 'js-cookie';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    const csrfToken = Cookies.get('XSRF-TOKEN');
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'XSRF-TOKEN': csrfToken || ''
        },
        body: JSON.stringify({ fullName: name, email, password }),
        credentials: 'include', // Ensures cookies are sent with the request
      });

      if (response.ok) {
        setSuccess('Registration successful. You can now log in.');
        setFormData({ name: '', email: '', password: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth>
          Register
        </Button>
      </form>
      <Typography variant="body2" align="center">
       Already have an account?{' '}
        <Link href="/login" passHref>
          <Button variant="text" color="primary">
            Login
          </Button>
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
