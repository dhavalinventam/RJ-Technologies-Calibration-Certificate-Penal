import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, Tooltip } from '@mui/material'
import { Brightness4, Brightness7, Menu as MenuIcon } from '@mui/icons-material'
import { Logo } from '@/assets/png'

interface HeaderProps {
  onToggleSidebar: () => void
  onToggleTheme: () => void
  mode: 'light' | 'dark'
  sidebarOpen?: boolean
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggleTheme, mode, sidebarOpen = true }) => {
  const theme = useTheme()

  return (
    <AppBar
      position='fixed'
      sx={{
        width: {
          xs: '100%',
          md: sidebarOpen ? `calc(100% - 0px)` : `calc(100% - 0px)`
        },
        ml: {
          xs: 0,
          md: sidebarOpen ? '250px' : '60px'
        },
        minHeight: 'unset',
        py: '9px',
        justifyContent: 'center',
        top: 0,
        color: 'text.primary',
        zIndex: '1203 !important',
        boxShadow: theme.palette.mode === 'light' ? 'unset' : '4px 3px 28px 0px rgba(var(--color-box-shadow))',
        backdropFilter: 'blur(8px)',
        background: theme.palette.mode === 'light' ? 'rgba(var(--nav-bg), 0.92)' : 'rgba(18, 24, 37)'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 }, minHeight: 'unset !important' }}>
        {/* Toggle Menu Button */}
        <IconButton
          color='primary'
          aria-label='toggle sidebar'
          edge='start'
          onClick={onToggleSidebar}
          sx={{
            mr: 2,
            height: 'max-content',
            minHeight: 'unset',
            px: { xs: '6px', md: '0px' },
            '&:hover': { backgroundColor: 'transparent' },
            '& .MuiTouchRipple-root ': { display: 'none' }
          }}
        >
          <MenuIcon sx={{ fontSize: '30px' }} />
        </IconButton>

        {/* LedgerX Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '240px' }}>
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            <img className='img-fluid' src={Logo} alt='side_img' style={{ maxWidth: '42px' }} />
          </Typography>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              color='primary'
              onClick={onToggleTheme}
              sx={{
                display: 'flex',
                padding: '10px',
                width: '37px',
                height: '37px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px !important',
                margin: '0 auto',
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'action.hover'
                },
                backgroundColor: 'rgb(var(--color-sf-primary), 0.1)'
              }}
            >
              {mode === 'light' ? (
                <Brightness4 sx={{ fontSize: '16px', color: 'rgb(var(--color-sf-primary))' }} />
              ) : (
                <Brightness7 sx={{ fontSize: '16px', color: 'rgb(var(--color-sf-white))' }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
