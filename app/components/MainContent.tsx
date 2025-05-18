"use client";

import { Box, Typography } from '@mui/material';

export default function MainContent() {
  return (
    <Box sx={{ p: { xs: '1.5rem', md: '3rem' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 4rem)' }}>
      <Typography variant="h3" sx={{ mb: 2, color: '#00fff7', textShadow: '0 0 0.75rem #00fff7' }}>
        Welcome to CommandNet
      </Typography>
      <Typography variant="h6" sx={{ maxWidth: '37.5rem', textAlign: 'center', color: 'text.primary', mb: 4 }}>
        CommandNet is your gateway to the SpaceTraders universe. Manage your fleet, trade resources, and automate your journey through the stars—all with a modern, sci-fi inspired interface.
      </Typography>
    </Box>
  );
} 