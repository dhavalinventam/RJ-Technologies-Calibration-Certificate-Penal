import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { ChevronRight, ExpandLess, ExpandMore } from '@mui/icons-material'
import { menuItems } from './sidebarMenu'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

const drawerWidth = 250
const miniDrawerWidth = 60

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

  const handleToggleMenu = (itemText: string) => {
    setOpenMenus(prev => ({ ...prev, [itemText]: !prev[itemText] }))
  }

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(18, 24, 37)' : theme.palette.background.paper,
        boxShadow: 'rgb(var(--color-box-shadow))',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        }),
        width: open ? drawerWidth : miniDrawerWidth
      }}
    >
      {/* Main Navigation Menu */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item: any) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  if (item.subItems) {
                    handleToggleMenu(item.text)
                  } else {
                    navigate(item.path)
                  }
                }}
                selected={
                  currentPath?.startsWith(item.path) ||
                  (item.subItems && item.subItems.some((sub: any) => sub.path?.startsWith(currentPath)))
                }
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  justifyContent: open ? 'initial' : 'center',
                  minHeight: '38px',
                  px: open ? 1 : 1,
                  '& .MuiListItemText-primary': {
                    fontSize: '14px',
                    lineHeight: 1,
                    fontWeight: 400
                  },
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.contrastText
                    },
                    '& .MuiListItemText-primary': {
                      color: theme.palette.primary.contrastText
                    }
                  },
                  '&.MuiButtonBase-root.Mui-active': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,

                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.contrastText
                    },
                    '& .MuiListItemText-primary': {
                      color: theme.palette.primary.contrastText
                    }
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 'auto' : 'auto',
                    ml: open ? '5px' : '5px',
                    justifyContent: 'center',
                    color:
                      currentPath === item.path ||
                      (item.subItems && item.subItems.some((sub: any) => sub.path === currentPath))
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary
                  }}
                >
                  {item.icon && React.cloneElement(item.icon, { sx: { fontSize: '18px' } })}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    sx={{
                      ml: 1
                    }}
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight:
                        currentPath === item.path ||
                        (item.subItems && item.subItems.some((sub: any) => sub.path === currentPath))
                          ? 600
                          : 400,
                      color:
                        currentPath === item.path ||
                        (item.subItems && item.subItems.some((sub: any) => sub.path === currentPath))
                          ? theme.palette.primary.contrastText
                          : theme.palette.text.primary
                    }}
                  />
                )}
                {item.subItems ? (
                  open ? (
                    openMenus[item.text] ? (
                      <ExpandLess sx={{ fontSize: 18 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 18 }} />
                    )
                  ) : null
                ) : item.hasArrow && open ? (
                  <ChevronRight
                    sx={{
                      fontSize: 16,
                      color:
                        currentPath === item.path ? theme.palette.primary.contrastText : theme.palette.text.secondary
                    }}
                  />
                ) : null}
              </ListItemButton>
            </ListItem>
            {/* Sub-menu items */}
            {item.subItems && open && (
              <Collapse in={openMenus[item.text]} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {item.subItems.map((sub: any) => (
                    <ListItem key={sub.text} disablePadding>
                      <ListItemButton
                        onClick={() => navigate(sub.path)}
                        selected={currentPath?.startsWith(sub.path)}
                        sx={{
                          ml: 4,
                          mr: 1,
                          borderRadius: 2,
                          marginBottom: '4px',
                          transition: 'all 0.2s ease-in-out',
                          justifyContent: open ? 'initial' : 'center',
                          minHeight: '30px',
                          px: open ? 2 : 1,
                          py: open ? 0 : 0,

                          backgroundColor: 'unset !important',
                          color: 'rgba(var(--primary)) !important',
                          '& .MuiListItemIcon-root': {
                            color: 'rgba(var(--primary)) !important'
                          },

                          '& .MuiListItemText-primary': {
                            fontSize: '14px',
                            lineHeight: 1,
                            fontWeight: 400
                          },
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark
                            },
                            '& .MuiListItemIcon-root': {
                              color: theme.palette.primary.contrastText
                            },
                            '& .MuiListItemText-primary': {
                              color: 'rgba(var(--color-sf-primary)) !important',
                              fontWeight: 600
                            }
                          },
                          '&.MuiButtonBase-root.Mui-active': {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,

                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark
                            },
                            '& .MuiListItemIcon-root': {
                              color: theme.palette.primary.contrastText
                            },
                            '& .MuiListItemText-primary': {
                              // color: theme.palette.primary.contrastText
                            }
                          },
                          '& .MuiTouchRipple-root': {
                            display: 'none !important'
                          },
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover
                          }
                        }}
                      >
                        <ListItemText
                          primary={sub.text}
                          primaryTypographyProps={{
                            fontWeight: currentPath === sub.path ? 600 : 400,
                            color:
                              currentPath === sub.path
                                ? theme.palette.primary.contrastText
                                : theme.palette.text.secondary
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant='temporary'
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            // boxShadow: theme.shadows[8],
            backgroundColor: theme.palette.background.paper,
            top: '64px', // Below mobile header
            height: 'calc(100vh - 64px)',
            left: 0
          }
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant='permanent'
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: open ? drawerWidth : miniDrawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          overflowX: 'hidden',
          border: 'none',
          boxShadow: '-6px 4px 32px -2px rgb(var(--color-box-shadow))',
          backgroundColor: theme.palette.background.paper,
          left: 0, // Position at left edge
          top: isMobile ? '64px' : 64,
          height: 'calc(100vh - 64px)',
          zIndex: '1 !important'
        }
      }}
      open={open}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar
