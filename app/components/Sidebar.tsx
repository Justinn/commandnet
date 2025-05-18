"use client";

import { Drawer, Toolbar, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PublicIcon from '@mui/icons-material/Public';
import StorefrontIcon from '@mui/icons-material/Storefront';

const NEON_COLOR = '#00bfff'; // blue-cyan neon (Deep Sky Blue)

const navItems = [
  { label: 'Home', icon: <HomeIcon sx={{ color: NEON_COLOR, filter: `drop-shadow(0 0 0.5rem ${NEON_COLOR})` }} />, active: true, disabled: false },
  { label: 'Agent', icon: <PersonIcon sx={{ color: NEON_COLOR, filter: `drop-shadow(0 0 0.5rem ${NEON_COLOR})` }} />, active: false, disabled: true },
  { label: 'Ships', icon: <RocketLaunchIcon sx={{ color: NEON_COLOR, filter: `drop-shadow(0 0 0.5rem ${NEON_COLOR})` }} />, active: false, disabled: true },
  { label: 'Contracts', icon: <AssignmentIcon sx={{ color: NEON_COLOR, filter: `drop-shadow(0 0 0.5rem ${NEON_COLOR})` }} />, active: false, disabled: true },
  { label: 'Systems', icon: <PublicIcon sx={{ color: NEON_COLOR, filter: `drop-shadow(0 0 0.5rem ${NEON_COLOR})` }} />, active: false, disabled: true },
  { label: 'Markets', icon: <StorefrontIcon sx={{ color: NEON_COLOR, filter: `drop-shadow(0 0 0.5rem ${NEON_COLOR})` }} />, active: false, disabled: true },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="persistent"
      open
      sx={{
        position: 'relative',
        width: '14rem',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'relative',
          width: '14rem',
          boxSizing: 'border-box',
          bgcolor: '#101624',
          borderRight: '0.125rem solid #00bfff',
          boxShadow: '0 0 1.5rem #00bfff',
          background: 'linear-gradient(135deg, #101624 60%, #2d1a4a 100%)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#00bfff',
            fontFamily: 'var(--font-share-tech-mono)',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '0.18em',
            textShadow: '0 0 1rem #00bfff',
            mb: 2,
            ml: 2,
            textTransform: 'uppercase',
          }}
        >
          Menu
        </Typography>
        <List>
          {navItems.map((item) => {
            const button = (
              <ListItemButton
                key={item.label}
                selected={item.active}
                disabled={item.disabled}
                sx={{
                  borderRadius: '0.25rem',
                  mx: 0.5,
                  mb: 0.5,
                  py: 0.5,
                  minHeight: '2.2rem',
                  background: item.active
                    ? 'linear-gradient(90deg, rgba(16,22,36,0.95) 60%, rgba(45,26,74,0.95) 100%)'
                    : 'rgba(16,22,36,0.7)',
                  boxShadow: item.active ? `0 0 0.5rem ${NEON_COLOR}` : 'none',
                  border: item.active ? `1px solid ${NEON_COLOR}` : '1px solid rgba(0,191,255,0.08)',
                  opacity: item.disabled ? 0.5 : 1,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  color: NEON_COLOR,
                  '&:hover': item.disabled
                    ? {}
                    : {
                        background: 'linear-gradient(90deg, rgba(16,22,36,1) 60%, rgba(45,26,74,1) 100%)',
                        boxShadow: `0 0 0.7rem ${NEON_COLOR}`,
                        border: `1px solid ${NEON_COLOR}`,
                      },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ minWidth: '1.7rem', fontSize: '1.2rem' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        color: NEON_COLOR,
                        fontFamily: 'var(--font-share-tech-mono)',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        letterSpacing: '0.12em',
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
            return item.disabled ? (
              <Tooltip key={item.label} title="Under construction" placement="right" arrow>
                <span style={{ display: 'block' }}>{button}</span>
              </Tooltip>
            ) : (
              button
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
} 