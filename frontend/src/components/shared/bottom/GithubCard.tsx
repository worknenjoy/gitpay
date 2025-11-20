import React from 'react'
import { useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import { FormattedMessage } from 'react-intl'
import Typography from '@mui/material/Typography'
import GithubLogo from 'images/github-logo-bottom.png'

export default function GithubCard(): JSX.Element {
  const theme = useTheme()

  const hanldeGithubLink = () => {
    window.open('https://github.com/worknenjoy/gitpay', '_blank')
  }

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: '20px 0',
        '&:hover': {
          cursor: 'pointer',
        },
      }}
      onClick={hanldeGithubLink}
    >
      <Typography variant="body2" component="span">
        <FormattedMessage id="join-github" defaultMessage={'Join our Open Source repository on'} />
      </Typography>
      <img src={GithubLogo} width={160} />
    </Card>
  )
}
