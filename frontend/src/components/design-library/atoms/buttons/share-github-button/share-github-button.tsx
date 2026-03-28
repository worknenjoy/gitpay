import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { GitHub as GitHubIcon } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'

type ShareGithubButtonProps = {
  taskId: number | string
  user: { logged: boolean; data?: { provider?: string; provider_username?: string } }
  shareToGithub: (taskId: number | string) => void
  authorizeGithub: (taskId?: number | string) => void
}

export default function ShareGithubButton({
  taskId,
  user,
  shareToGithub,
  authorizeGithub
}: ShareGithubButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!user.logged) {
      window.location.href = '/#/signin'
      return
    }
    const hasGithub = user.data?.provider === 'github' || !!user.data?.provider_username
    if (!hasGithub) {
      authorizeGithub(taskId)
      return
    }
    setLoading(true)
    await shareToGithub(taskId)
    setLoading(false)
  }

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<GitHubIcon />}
      onClick={handleClick}
      disabled={loading}
      fullWidth
      sx={{ mt: 1 }}
    >
      <FormattedMessage id="task.share.github.button" defaultMessage="Share on GitHub" />
    </Button>
  )
}
