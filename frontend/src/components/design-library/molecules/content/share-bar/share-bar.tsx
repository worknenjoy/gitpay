import React, { useState } from 'react'
import { IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material'
import { defineMessages, useIntl } from 'react-intl'
import {
  X as XIcon,
  LinkedIn as LinkedInIcon,
  Reddit as RedditIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  NotificationsNone as BellIcon,
  NotificationsActive as BellOnIcon
} from '@mui/icons-material'
import ActionsMenu from 'design-library/molecules/menus/actions-menu/actions-menu'
import {
  Root,
  UrlButton,
  UrlText,
  CopyLabel,
  Separator,
  Targets,
  FollowButton,
  FollowCount
} from './share-bar.styles'

export type ShareBarFollow = {
  following: boolean
  /** Number of followers, shown as a small count. */
  count?: number
  onToggle: () => void
  /** Tooltip shown on the follow segment. */
  tooltip?: React.ReactNode
}

export type ShareBarProps = {
  url: string
  label?: React.ReactNode
  /** Tooltip / title for the copy button. Defaults to "Copy profile link". */
  copyTitle?: string
  /** Optional Follow segment rendered first. Omitted → no follow segment. */
  follow?: ShareBarFollow
}

const COPIED_FEEDBACK_MS = 1600

const messages = defineMessages({
  copyLink: {
    id: 'profile.shareBar.copyLink',
    defaultMessage: 'Copy profile link'
  },
  copy: {
    id: 'profile.shareBar.copy',
    defaultMessage: 'Copy'
  },
  copied: {
    id: 'profile.shareBar.copied',
    defaultMessage: 'Copied'
  },
  shareOnX: {
    id: 'profile.shareBar.shareOnX',
    defaultMessage: 'Share on X'
  },
  shareOnLinkedIn: {
    id: 'profile.shareBar.shareOnLinkedIn',
    defaultMessage: 'Share on LinkedIn'
  },
  shareOnReddit: {
    id: 'profile.shareBar.shareOnReddit',
    defaultMessage: 'Share on Reddit'
  },
  shareByEmail: {
    id: 'profile.shareBar.shareByEmail',
    defaultMessage: 'Share by email'
  },
  follow: {
    id: 'shareBar.follow',
    defaultMessage: 'Follow'
  },
  following: {
    id: 'shareBar.following',
    defaultMessage: 'Following'
  }
})

const ShareBar = ({ url, label, copyTitle, follow }: ShareBarProps) => {
  const intl = useIntl()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [copied, setCopied] = useState(false)
  const displayLabel = label ?? url.replace(/^https?:\/\//, '')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    } catch (err) {
      // clipboard access denied or unavailable — nothing to recover here
    }
  }

  const shareTargets = [
    {
      id: 'x',
      title: intl.formatMessage(messages.shareOnX),
      icon: <XIcon fontSize="small" />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
    },
    {
      id: 'linkedin',
      title: intl.formatMessage(messages.shareOnLinkedIn),
      icon: <LinkedInIcon fontSize="small" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      id: 'reddit',
      title: intl.formatMessage(messages.shareOnReddit),
      icon: <RedditIcon fontSize="small" />,
      href: `https://reddit.com/submit?url=${encodeURIComponent(url)}`
    },
    {
      id: 'email',
      title: intl.formatMessage(messages.shareByEmail),
      icon: <EmailIcon fontSize="small" />,
      href: `mailto:?body=${encodeURIComponent(url)}`
    }
  ]

  return (
    <Root>
      {follow && (
        <>
          <Tooltip title={follow.tooltip || ''}>
            <FollowButton
              type="button"
              aria-pressed={follow.following}
              data-following={follow.following}
              onClick={follow.onToggle}
            >
              {follow.following ? <BellOnIcon fontSize="small" /> : <BellIcon fontSize="small" />}
              {intl.formatMessage(follow.following ? messages.following : messages.follow)}
              {typeof follow.count === 'number' && <FollowCount>{follow.count}</FollowCount>}
            </FollowButton>
          </Tooltip>
          <Separator />
        </>
      )}
      <UrlButton onClick={handleCopy} title={copyTitle || intl.formatMessage(messages.copyLink)}>
        <LinkIcon fontSize="small" />
        <UrlText variant="caption">{displayLabel}</UrlText>
        <CopyLabel variant="caption" data-copied={copied}>
          {copied ? intl.formatMessage(messages.copied) : intl.formatMessage(messages.copy)}
        </CopyLabel>
      </UrlButton>
      <Separator />
      {isMobile ? (
        // The 4 separate icon buttons are the main reason this pill doesn't
        // fit narrow screens — collapse them into one overflow menu instead
        // of shrinking (and hiding) each one individually.
        <ActionsMenu
          actions={shareTargets.map((target) => ({
            children: target.title,
            icon: target.icon,
            onClick: () => window.open(target.href, '_blank', 'noreferrer')
          }))}
        />
      ) : (
        <Targets>
          {shareTargets.map((target) => (
            <Tooltip key={target.id} title={target.title}>
              <IconButton
                size="small"
                aria-label={target.title}
                href={target.href}
                target="_blank"
                rel="noreferrer"
              >
                {target.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Targets>
      )}
    </Root>
  )
}

export default ShareBar
