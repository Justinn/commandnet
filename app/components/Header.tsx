"use client";

import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export default function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'transparent',
        background: 'linear-gradient(90deg, #101624 60%, #0a0f1a 100%)',
        boxShadow: 'none',
        borderBottom: '0.02rem solid #00fff7',
        px: 0,
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-start', minHeight: '5.5rem !important', px: 0 }}>
        <Typography
          variant="h2"
          sx={{
            color: '#00fff7',
            fontFamily: 'var(--font-share-tech-mono)',
            fontWeight: 900,
            fontSize: '2.5rem',
            letterSpacing: '0.12em',
            textShadow: '0 0 2rem #00fff7, 0 0 1rem #00fff7',
            textAlign: 'left',
            flexGrow: 0,
            lineHeight: 1.1,
          }}
        >
          CommandNet
        </Typography>
      </Toolbar>
      <Box sx={{ height: '0.25rem', width: '100%', background: 'linear-gradient(90deg, #00fff7 0%, #0a0f1a 100%)', boxShadow: '0 0 1.5rem #00fff7' }} />
    </AppBar>
  );
} 