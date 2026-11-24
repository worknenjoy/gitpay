import React from 'react'
import { useIntl } from 'react-intl'
import ShareBar from 'design-library/molecules/content/share-bar/share-bar'

type IssueShareBarProps = {
  url: string
  /** Follow segment — only rendered when `onFollow` is provided. */
  following?: boolean
  followers?: number
  onFollow?: () => void
}

/** The issue page share bar: copy link + share targets, with Follow first when available. */
const IssueShareBar = ({ url, following = false, followers, onFollow }: IssueShareBarProps) => {
  const intl = useIntl()
  return (
    <ShareBar
      url={url}
      copyTitle={intl.formatMessage({
        id: 'issue.shareBar.copyLink',
        defaultMessage: 'Copy issue link'
      })}
      follow={
        onFollow
          ? {
              following,
              count: followers,
              onToggle: onFollow,
              tooltip: following
                ? intl.formatMessage({
                    id: 'issue.shareBar.following.tooltip',
                    defaultMessage:
                      'You will be notified when a bounty is added, a solution is sent, or this issue is paid.'
                  })
                : intl.formatMessage({
                    id: 'issue.shareBar.follow.tooltip',
                    defaultMessage: 'Get notified when a bounty is added or a solution is sent.'
                  })
            }
          : undefined
      }
    />
  )
}

export default IssueShareBar
