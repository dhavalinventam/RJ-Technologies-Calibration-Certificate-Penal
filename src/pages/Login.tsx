import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Checkbox } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/assets/png'
import loginPageImg from '@/assets/jpg/login-page-img.jpg'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: 'stanley@gmail.com',
    password: '',
    rememberMe: true
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login submitted', formData)
    // Redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <Box className='login-container'>
      {/* Left Panel - Login Form */}
      <Box className='login-form-panel'>
        <Box className='login-form-content'>
          {/* Logo */}
          <Box className='login-logo-container'>
            <img src={Logo} alt='Logo' className='login-logo-image' />
            <Typography variant='h4' className='logo-text'>
              Technologies
            </Typography>
          </Box>

          {/* Welcome Message */}
          <Typography variant='h3' className='welcome-title'>
            Hello, Welcome
          </Typography>
          <Typography variant='body1' className='welcome-subtitle'>
            Sign in to your account to continue
          </Typography>

          {/* Login Form */}
          <Box component='form' onSubmit={handleSubmit} className='login-form'>
            <Box className='input-wrapper'>
              <Typography variant='body2' className='input-label'>
                Email
              </Typography>
              <TextField
                fullWidth
                type='email'
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder='Enter your email'
                className='login-input'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.4)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#2563EB'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB'
                    },
                    '& input': {
                      padding: '12px 16px'
                    }
                  }
                }}
              />
            </Box>

            <Box className='input-wrapper'>
              <Typography variant='body2' className='input-label'>
                Password
              </Typography>
              <TextField
                fullWidth
                type='password'
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder='Enter your password'
                className='login-input'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.4)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#2563EB'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2563EB'
                    },
                    '& input': {
                      padding: '12px 16px'
                    }
                  }
                }}
              />
            </Box>

            {/* Remember Me and Forgot Password */}
            <Box className='login-options'>
              <Box className='remember-me-container'>
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={e => handleInputChange('rememberMe', e.target.checked)}
                  sx={{
                    color: '#2563EB',
                    '&.Mui-checked': {
                      color: '#2563EB'
                    },
                    p: 0.5
                  }}
                />
                <Typography variant='body2' className='remember-me-text'>
                  Remember me
                </Typography>
              </Box>
              <Link to='/forgot-password' className='forgot-password-link'>
                Forgot Password?
              </Link>
            </Box>

            {/* Sign In Button */}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              className='sign-in-button'
              sx={{
                mt: 2.5,
                mb: 2.5,
                py: 1.5,
                borderRadius: '999px',
                backgroundColor: '#2563EB',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 600,
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.18)',
                '&:hover': {
                  backgroundColor: '#1D4ED8',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)'
                }
              }}
            >
              Sign In
            </Button>

            {/* Sign Up Link */}
            {/* <Box className='sign-up-container'>
              <Typography variant='body2' className='sign-up-text'>
                Don't have an account?{' '}
                <Link to='#' className='sign-up-link'>
                  Sign Up
                </Link>
              </Typography>
            </Box> */}
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Image */}
      <Box className='login-illustration-panel'>
        <img src={loginPageImg} alt='Login Illustration' className='login-page-image' />
      </Box>
    </Box>
  )
}

export default Login
