import React, { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { defineMessages, useIntl } from 'react-intl'
import {
  X as XIcon,
  LinkedIn as LinkedInIcon,
  Reddit as RedditIcon,
  Email as EmailIcon,
  Link as LinkIcon
} from '@mui/icons-material'
import { Root, UrlButton, UrlText, CopyLabel, Separator, Targets } from './share-bar.styles'

export type ShareBarProps = {
  url: string
  label?: React.ReactNode
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
  }
})

const ShareBar = ({ url, label }: ShareBarProps) => {
  const intl = useIntl()
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
      <UrlButton onClick={handleCopy} title={intl.formatMessage(messages.copyLink)}>
        <LinkIcon fontSize="small" />
        <UrlText variant="caption">{displayLabel}</UrlText>
        <CopyLabel variant="caption" data-copied={copied}>
          {copied ? intl.formatMessage(messages.copied) : intl.formatMessage(messages.copy)}
        </CopyLabel>
      </UrlButton>
      <Separator />
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
    </Root>
  )
}

export default ShareBar
