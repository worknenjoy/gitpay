import React from 'react'
import Button from 'design-library/atoms/buttons/button/button'
import { Root } from './drawer-actions.styles'

const DrawerActions = ({ actions, completed = true }) => {
  return (
    <Root>
      {actions.map((action, index) => (
        <Button
          key={`drawer-action-button-${index}`}
          onClick={action.onClick}
          variant={action.variant}
          color={action.color}
          disabled={action.disabled}
          label={action.label}
          completed={completed}
        />
      ))}
    </Root>
  )
}

export default DrawerActions
