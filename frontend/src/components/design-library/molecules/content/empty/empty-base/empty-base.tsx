import React from 'react'
import { Box } from '@mui/material'
import { DataObject as EmptyIcon } from '@mui/icons-material'
import Button from '../../../../atoms/buttons/button/button'
import { Root, Message, IconContainer, MessageSecondary } from './empty-base.styles'

type EmptyBaseProps = {
  onActionClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  icon?: React.ReactElement
  text?: string | React.ReactNode
  secondaryText?: string | React.ReactNode
  actionText?: string | React.ReactNode
  completed?: boolean
}

const EmptyBase = ({
  onActionClick = () => {},
  icon = <EmptyIcon />,
  text = 'No Data',
  secondaryText,
  actionText = 'Create your first item',
  completed = true
}: EmptyBaseProps) => {
  return (
    <Box component={Root as any}>
      {icon && <IconContainer>{icon}</IconContainer>}
      <Message variant="h6" gutterBottom>
        {text}
      </Message>
      {secondaryText && (
        <MessageSecondary variant="body1" color="textSecondary" gutterBottom>
          {secondaryText}
        </MessageSecondary>
      )}
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        color="secondary"
        onClick={onActionClick}
        completed={completed}
        label={actionText}
      />
    </Box>
  )
}

export default EmptyBase
