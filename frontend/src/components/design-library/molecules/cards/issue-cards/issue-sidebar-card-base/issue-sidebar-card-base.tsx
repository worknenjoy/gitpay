import React from 'react'
import { Link } from '@mui/material'
import IssueSidebarCardBasePlaceholder from './issue-sidebar-card-base.placeholder'
import { Card, Head, Caption, Body, Footer } from './issue-sidebar-card-base.styles'

export type IssueSidebarCardAction = {
  label: React.ReactNode
  onClick?: () => void
  href?: string
}

export type IssueSidebarCardBaseProps = {
  caption: React.ReactNode
  captionIcon?: React.ReactNode
  /** A text link on the right of the caption (e.g. "View breakdown"). */
  headerAction?: IssueSidebarCardAction
  children?: React.ReactNode
  /** Small centered note under the body. */
  footer?: React.ReactNode
  completed?: boolean
  /** Tighter vertical rhythm for list-style cards. */
  dense?: boolean
}

/**
 * Frame shared by every card in the issue page rail: an uppercase caption with an
 * optional link, a body, and an optional footer note. Specific cards
 * (bounty, solve, GitHub, owner, share) only fill the body.
 */
const IssueSidebarCardBase = ({
  caption,
  captionIcon,
  headerAction,
  children,
  footer,
  completed = true,
  dense = false
}: IssueSidebarCardBaseProps) => {
  if (!completed) return <IssueSidebarCardBasePlaceholder />

  return (
    <Card dense={dense}>
      <Head>
        <Caption>
          {captionIcon}
          {caption}
        </Caption>
        {headerAction && (
          <Link
            component={headerAction.href ? 'a' : 'button'}
            href={headerAction.href}
            target={headerAction.href ? '_blank' : undefined}
            rel={headerAction.href ? 'noopener noreferrer' : undefined}
            onClick={headerAction.onClick}
            underline="always"
            sx={{ fontSize: 13, cursor: 'pointer', textUnderlineOffset: 3 }}
          >
            {headerAction.label}
          </Link>
        )}
      </Head>
      {children && <Body>{children}</Body>}
      {footer && <Footer>{footer}</Footer>}
    </Card>
  )
}

export default IssueSidebarCardBase
