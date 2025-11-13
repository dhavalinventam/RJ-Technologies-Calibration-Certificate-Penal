import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'
import {
  Menu as MenuIcon,
  Lock,
  Logout,
  AccountCircle,
  Close as CloseIcon,
  KeyboardArrowDown
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/assets/png'
import { getUsersInfo, handleClearStorage, getNameInitials, getColorFromString } from '@/utils/common'

interface HeaderProps {
  onToggleSidebar: () => void
  onToggleTheme: () => void
  mode: 'light' | 'dark'
  sidebarOpen?: boolean
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen = true }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const open = Boolean(anchorEl)

  useEffect(() => {
    const user = getUsersInfo()
    setUserInfo(user)
    if (user?.profile_image_url) {
      setProfileImage(user.profile_image_url)
    }
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangePassword = () => {
    handleClose()
    setChangePasswordOpen(true)
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordSubmit = () => {
    // Handle password change logic here
    console.log('Change password:', passwordData)
    setChangePasswordOpen(false)
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    })
  }

  const handleLogout = () => {
    handleClose()
    handleClearStorage()
    navigate('/login')
  }

  const getUserName = () => {
    if (userInfo) {
      return `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim() || userInfo.email || 'User'
    }
    return 'User'
  }

  const userName = getUserName()
  const userInitials = getNameInitials(userName)
  const initialsColor = getColorFromString(userName)

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          {/* Theme Toggle */}
          {/* <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
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
          </Tooltip> */}

          {/* Profile Section */}
          <Box>
            <Box
              onClick={handleClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              {profileImage ? (
                <Avatar
                  src={profileImage}
                  alt={userName}
                  sx={{
                    width: 36,
                    height: 36,
                    border: `2px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: initialsColor || '#2563EB',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: `2px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`
                  }}
                >
                  {userInitials || <AccountCircle />}
                </Avatar>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.9375rem',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {userName}
                </Typography>
                {userInfo?.role && (
                  <Typography
                    variant='caption'
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.8125rem',
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {userInfo.role}
                  </Typography>
                )}
              </Box>
              <KeyboardArrowDown
                sx={{
                  fontSize: '20px',
                  color: 'text.secondary',
                  transition: 'transform 0.2s ease',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </Box>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  minWidth: 220,
                  borderRadius: '12px',
                  border:
                    theme.palette.mode === 'light'
                      ? '1px solid rgba(0, 0, 0, 0.08)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: theme.palette.mode === 'light' ? 'background.paper' : 'rgb(18, 24, 37)',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    borderLeft:
                      theme.palette.mode === 'light'
                        ? '1px solid rgba(0, 0, 0, 0.08)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop:
                      theme.palette.mode === 'light'
                        ? '1px solid rgba(0, 0, 0, 0.08)'
                        : '1px solid rgba(255, 255, 255, 0.08)'
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* User Info Section */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {profileImage ? (
                    <Avatar
                      src={profileImage}
                      alt={userName}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: initialsColor || '#2563EB'
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: initialsColor || '#2563EB',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 600
                      }}
                    >
                      {userInitials || <AccountCircle />}
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {userName}
                    </Typography>
                    {userInfo?.email && (
                      <Typography
                        variant='caption'
                        sx={{
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}
                      >
                        {userInfo.email}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Menu Items */}
              <MenuItem
                onClick={handleChangePassword}
                sx={{
                  py: 1.5,
                  px: 2,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.16)'
                  }
                }}
              >
                <Lock sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  Change Password
                </Typography>
              </MenuItem>

              <Divider sx={{ my: 0.5 }} />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  px: 2,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'light' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.16)'
                  }
                }}
              >
                <Logout sx={{ mr: 1.5, fontSize: 20, color: 'error.main' }} />
                <Typography variant='body2' sx={{ color: 'error.main', fontWeight: 500 }}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordOpen}
        onClose={() => {
          setChangePasswordOpen(false)
          setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
          })
        }}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
            fontWeight: 600
          }}
        >
          Change Password
          <IconButton
            aria-label='close'
            onClick={() => {
              setChangePasswordOpen(false)
              setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
              })
            }}
            sx={{
              color: theme => theme.palette.grey[500],
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              type='password'
              label='Current Password'
              value={passwordData.current_password}
              onChange={e => handlePasswordChange('current_password', e.target.value)}
              variant='outlined'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
            <TextField
              fullWidth
              type='password'
              label='New Password'
              value={passwordData.new_password}
              onChange={e => handlePasswordChange('new_password', e.target.value)}
              variant='outlined'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
            <TextField
              fullWidth
              type='password'
              label='Confirm New Password'
              value={passwordData.confirm_password}
              onChange={e => handlePasswordChange('confirm_password', e.target.value)}
              variant='outlined'
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant='outlined'
            onClick={() => {
              setChangePasswordOpen(false)
              setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
              })
            }}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={handlePasswordSubmit}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              backgroundColor: '#2563EB',
              '&:hover': {
                backgroundColor: '#1D4ED8'
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  )
}

export default Header
