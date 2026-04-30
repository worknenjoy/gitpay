import React from 'react'
import { Box, Card, CardContent, Divider } from '@mui/material'

interface ResourceCardProps {
  header: React.ReactNode
  footer: React.ReactNode
  children?: React.ReactNode
}

const ResourceCard = ({ header, children, footer }: ResourceCardProps) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      background: 'transparent',
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: 3 }
    }}
  >
    <CardContent sx={{ pb: 1.5 }}>
      {header}
      {children}
    </CardContent>
    <Box flexGrow={1} />
    <Divider />
    <Box px={2} py={1.25} display="flex" justifyContent="space-between" alignItems="center">
      {footer}
    </Box>
  </Card>
)

export default ResourceCard
