'use client';

import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from '@/app/theme';

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.main};
    min-height: 100vh;
    margin: 0;
  }
`;

export default function StyledThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
} 