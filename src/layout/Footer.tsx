import React from 'react'
import { Box, Typography, Container } from '@mui/material'

const Footer: React.FC = () => {
  return (
    <Box
      component='footer'
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth='lg'>
        <Typography variant='body2' color='text.secondary' align='center'>
          © 2025 Admin Panel. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
