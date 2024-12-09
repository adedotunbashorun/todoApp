import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';

const theme = createTheme();

const MyApp = ({ Component, pageProps }: AppProps) => (
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </AuthProvider>
);

export default MyApp;
