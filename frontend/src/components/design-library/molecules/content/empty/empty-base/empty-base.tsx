import React from 'react'
import { Box } from '@mui/material'
import { DataObject as EmptyIcon } from '@mui/icons-material'
import Button from '../../../../atoms/buttons/button/button'
import { Root, Message, IconContainer, MessageSecondary } from './empty-base.styles'

type EmptyBaseProps = {
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  icon?: React.ReactElement
  /** Icon container font-size in px. Defaults to 72 for full-page empty states; pass something smaller (e.g. 32) when embedding inside a compact list or card. */
  iconSize?: number
  text?: string | React.ReactNode
  secondaryText?: string | React.ReactNode
  actionText?: string | React.ReactNode
  completed?: boolean
  /** Renders in place of the default action button — use for an action that isn't a single plain button (e.g. a split button with multiple options). */
  actionComponent?: React.ReactNode
}

const EmptyBase = ({
  onActionClick,
  icon = <EmptyIcon />,
  iconSize,
  text = 'No Data',
  secondaryText,
  actionText = 'Create your first item',
  completed = true,
  actionComponent
}: EmptyBaseProps) => {
  return (
    <Box component={Root as any}>
      {icon && <IconContainer iconSize={iconSize}>{icon}</IconContainer>}
      <Message variant="h6" gutterBottom>
        {text}
      </Message>
      {secondaryText && (
        <MessageSecondary variant="body1" color="textSecondary" gutterBottom>
          {secondaryText}
        </MessageSecondary>
      )}
      {actionComponent ? (
        <Box sx={{ mt: 2 }}>{actionComponent}</Box>
      ) : (
        onActionClick && (
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="secondary"
            onClick={onActionClick}
            completed={completed}
            label={actionText}
          />
        )
      )}
    </Box>
  )
}

export default EmptyBase
