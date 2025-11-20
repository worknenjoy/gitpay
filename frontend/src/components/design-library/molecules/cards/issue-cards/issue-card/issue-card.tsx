import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Avatar, Card, Link, Tooltip, Typography } from '@mui/material'
import MomentComponent from 'moment'

import logoGithub from 'images/github-logo-black.png'
import logoBitbucket from 'images/bitbucket-logo-blue.png'
import { StyledCardHeader, StyledAvatar, TaskTitle } from './issue-card.styles'

const IssueCard = ({ issue }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const renderIssueAuthorLink = () => {
    if (issue.data.metadata && issue.data.metadata?.issue?.user?.html_url) {
      return (
        <Link href={`${issue.data.metadata.issue.user.html_url}`} target="_blank">
          <FormattedMessage
            id="task.status.created.name.short"
            defaultMessage="by {name}"
            values={{
              name: issue.data.metadata ? issue.data.metadata?.issue?.user?.login : 'unknown'
            }}
          />
        </Link>
      )
    } else {
      return (
        <FormattedMessage
          id="task.status.created.name.short"
          defaultMessage="by {name}"
          values={{
            name: issue.data.metadata ? issue.data.metadata?.issue?.user?.login : 'unknown'
          }}
        />
      )
    }
  }

  const updatedAtTimeString = MomentComponent(issue?.data?.updated_at)
    .utc()
    .format('DD/MM/YYYY hh:mm A')

  return (
    <Card>
      <StyledCardHeader
        avatar={
          <FormattedMessage
            id="task.status.created.name"
            defaultMessage="Created by {name}"
            values={{
              name: issue.data.metadata ? issue.data.metadata?.issue?.user?.login : 'unknown'
            }}
          >
            {(msg) => (
              <Tooltip id="tooltip-github" title={msg} placement="bottom">
                <a
                  href={`${issue.data.metadata?.issue?.user?.html_url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Avatar
                    src={issue.data.metadata?.issue?.user?.avatar_url}
                    component={StyledAvatar as any}
                  />
                </a>
              </Tooltip>
            )}
          </FormattedMessage>
        }
        title={
          <Typography variant="h6" color="primary">
            <Link href={`${issue.data.url}`} target="_blank" component={TaskTitle as any}>
              {issue.data.title}
              <img
                width="24"
                height="24"
                style={{ marginLeft: 10 }}
                src={issue.data.provider === 'github' ? logoGithub : logoBitbucket}
              />
            </Link>
          </Typography>
        }
        subheader={
          <Typography variant="body1" style={{ marginTop: 5 }} color="primary">
            {renderIssueAuthorLink()}
          </Typography>
        }
        action={
          <Typography variant="caption" style={{ padding: 10, color: 'gray', marginRight: 10 }}>
            <FormattedMessage id="task.bounties.interested.created" defaultMessage="created" />{' '}
            {updatedAtTimeString}
          </Typography>
        }
      />
    </Card>
  )
}

export default IssueCard
