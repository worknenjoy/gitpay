import React from 'react'
import TextEllipsis from 'text-ellipsis'
import slugify from '@sindresorhus/slugify'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Avatar, Tooltip, Typography } from '@mui/material'

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'
import messages from '../../../../../../../../messages/messages'

const IssueLinkField = ({ issue }) => {
  const history = useHistory()
  const intl = useIntl()
  const isProfile = history.location.pathname.includes('/profile')
  const isExplore = history.location.pathname.includes('/profile/explore')
  const profile = isProfile ? '/profile' : ''
  const explore = isExplore ? '/explore' : ''

  const handleClickListItem = (issue) => {
    const url = `${profile}${explore}/task/${issue.id}/${slugify(issue.title)}`
    history.push(url)
  }

  const getProviderLogo = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'github':
        return logoGithub
      case 'bitbucket':
        return logoBitbucket
      default:
        return null
    }
  }

  const logo = getProviderLogo(issue.provider)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {issue?.url && logo ? (
        <a
          target="_blank"
          href={issue.url}
          rel="noreferrer"
          style={{ flexShrink: 0, lineHeight: 0 }}
        >
          <Tooltip
            title={`${intl.formatMessage(messages.onHoverTaskProvider)} ${issue.provider}`}
            placement="top"
          >
            <img
              width="18"
              src={logo}
              style={{
                borderRadius: '50%',
                padding: 2,
                backgroundColor: 'black',
                display: 'block'
              }}
            />
          </Tooltip>
        </a>
      ) : (
        <Avatar sx={{ width: 18, height: 18, fontSize: '0.6rem', flexShrink: 0 }}>?</Avatar>
      )}
      <a style={{ cursor: 'pointer' }} onClick={() => handleClickListItem(issue)}>
        <Typography variant="body2">{TextEllipsis(`${issue?.title || 'no title'}`, 42)}</Typography>
      </a>
    </div>
  )
}

export default IssueLinkField
