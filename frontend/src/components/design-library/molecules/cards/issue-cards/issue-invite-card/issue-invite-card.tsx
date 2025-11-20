import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import TaskInvite from '../../../dialogs/issue-invite-dialog/issue-invite-dialog'
import { Root } from './issue-invite-card.styles'

export default function IssueInviteCard({ id, onInvite, onFunding, user }) {
  const [dialogContributorOpen, setDialogContributorOpen] = useState(false)

  const handleInviteContributor = (e) => {
    e.preventDefault()
    setDialogContributorOpen(true)
  }

  const handleInviteContributorClose = (e) => {
    e.preventDefault()
    setDialogContributorOpen(false)
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <Root>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <FormattedMessage id="task.invite.card.title" defaultMessage="Invite" />
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <FormattedMessage
              id="task.invite.card.content"
              defaultMessage="You can invite sponsors or contributors to raise funds and solve your issue"
            />
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button size="small" color="primary" onClick={handleInviteContributor}>
            <FormattedMessage
              id="task.invite.card.button.contributor"
              defaultMessage="Invite contributor"
            />
          </Button>
          <Button size="small" color="primary" onClick={onFunding}>
            <FormattedMessage
              id="task.invite.card.button.sponsor"
              defaultMessage="Invite sponsor"
            />
          </Button>
        </CardActions>
      </Root>
      <TaskInvite
        visible={dialogContributorOpen}
        onClose={handleInviteContributorClose}
        onInvite={onInvite}
        user={user}
        id={id}
      />
    </div>
  )
}
