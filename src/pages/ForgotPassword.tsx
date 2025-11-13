import React, { useState } from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { Logo } from '@/assets/png'
import loginPageImg from '@/assets/jpg/login-page-img.jpg'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    username: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log('Forgot password submitted', formData)
  }

  return (
    <Box className='forgot-password-container'>
      {/* Left Panel - Forgot Password Form */}
      <Box className='forgot-password-form-panel'>
        <Box className='forgot-password-form-content'>
          {/* Logo */}
          <Box className='forgot-password-logo-container'>
            <img src={Logo} alt='Logo' className='forgot-password-logo-image' />
            <Typography variant='h4' className='forgot-password-logo-text'>
              Technologies
            </Typography>
          </Box>

          {/* Title and Description */}
          <Typography variant='h3' className='forgot-password-title'>
            Forgot Password?
          </Typography>
          <Typography variant='body1' className='forgot-password-subtitle'>
            Enter your username and a mail will be sent to you with instructions.
          </Typography>

          {/* Forgot Password Form */}
          <Box component='form' onSubmit={handleSubmit} className='forgot-password-form'>
            <Box className='forgot-password-input-wrapper'>
              <Typography variant='body2' className='forgot-password-input-label'>
                Username
              </Typography>
              <TextField
                fullWidth
                type='text'
                value={formData.username}
                onChange={e => handleInputChange('username', e.target.value)}
                placeholder='Enter your username'
                className='forgot-password-input'
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

            {/* Submit Button */}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              className='forgot-password-submit-button'
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
              Send Instructions
            </Button>

            {/* Back to Login Link */}
            <Box className='forgot-password-back-container'>
              <Typography variant='body2' className='forgot-password-back-text'>
                Remember your password?{' '}
                <Link to='/login' className='forgot-password-back-link'>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Image */}
      <Box className='forgot-password-illustration-panel'>
        <img src={loginPageImg} alt='Forgot Password Illustration' className='forgot-password-page-image' />
      </Box>
    </Box>
  )
}

export default ForgotPassword
