"use client";

import { Drawer, Toolbar, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PublicIcon from '@mui/icons-material/Public';
import StorefrontIcon from '@mui/icons-material/Storefront';

const navItems = [
  { label: 'Home', icon: <HomeIcon sx={{ color: '#00fff7', filter: 'drop-shadow(0 0 0.5rem #00fff7)' }} />, active: true, disabled: false },
  { label: 'Agent', icon: <PersonIcon sx={{ color: '#00fff7', filter: 'drop-shadow(0 0 0.5rem #00fff7)' }} />, active: false, disabled: true },
  { label: 'Ships', icon: <RocketLaunchIcon sx={{ color: '#00fff7', filter: 'drop-shadow(0 0 0.5rem #00fff7)' }} />, active: false, disabled: true },
  { label: 'Contracts', icon: <AssignmentIcon sx={{ color: '#00fff7', filter: 'drop-shadow(0 0 0.5rem #00fff7)' }} />, active: false, disabled: true },
  { label: 'Systems', icon: <PublicIcon sx={{ color: '#00fff7', filter: 'drop-shadow(0 0 0.5rem #00fff7)' }} />, active: false, disabled: true },
  { label: 'Markets', icon: <StorefrontIcon sx={{ color: '#00fff7', filter: 'drop-shadow(0 0 0.5rem #00fff7)' }} />, active: false, disabled: true },
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
          borderRight: '0.125rem solid #00fff7',
          boxShadow: '0 0 1.5rem #00fff7',
          background: 'linear-gradient(135deg, #101624 60%, #2d1a4a 100%)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#00fff7',
            fontFamily: 'var(--font-share-tech-mono)',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '0.18em',
            textShadow: '0 0 1rem #00fff7',
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
                  borderRadius: '0.5rem',
                  mx: 1,
                  mb: 1,
                  background: item.active ? 'rgba(0,255,247,0.08)' : 'none',
                  boxShadow: item.active ? '0 0 1rem #00fff7' : 'none',
                  opacity: item.disabled ? 0.5 : 1,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  '&:hover': item.disabled
                    ? {}
                    : {
                        background: 'rgba(0,255,247,0.15)',
                        boxShadow: '0 0 1rem #00fff7',
                      },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ minWidth: '2.2rem' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        color: '#00fff7',
                        fontFamily: 'var(--font-share-tech-mono)',
                        fontWeight: 600,
                        fontSize: '1.05rem',
                        letterSpacing: '0.15em',
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