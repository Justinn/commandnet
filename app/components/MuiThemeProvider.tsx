"use client";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bfff', // blue-cyan neon
    },
    background: {
      default: '#0a0f1a',
      paper: '#111827',
    },
    text: {
      primary: '#e0f7fa',
      secondary: '#00bfff',
    },
  },
  typography: {
    fontFamily: [
      'var(--font-share-tech-mono)',
      'var(--font-geist-sans)',
      'var(--font-geist-mono)',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 