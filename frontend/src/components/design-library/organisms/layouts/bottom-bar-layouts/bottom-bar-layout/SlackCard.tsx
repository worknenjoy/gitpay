import React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import SlackLogo from 'images/slack-logo.png'

export default function SlackCard(): JSX.Element {
  const theme = useTheme()

  const hanldeInvite = () => {
    window.open(
      process.env.SLACK_CHANNEL_INVITE_LINK,
      '_blank'
    )
  }

  return (
    <Card sx={{ display: 'flex' }} onClick={hanldeInvite}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#F2F2F2',
          '&:hover': {
            cursor: 'pointer'
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'center',
            padding: '0 10px'
          }}
        >
          <CardMedia component="img" image={SlackLogo} alt="Join our slack" />
        </div>
        <CardContent sx={{ backgroundColor: '#37BA92', color: 'white' }}>
          <Typography variant="body2" component="span">
            Join our slack channel #gitpay to join our community
          </Typography>
        </CardContent>
      </Box>
    </Card>
  )
}
