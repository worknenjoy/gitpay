import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from '@mui/material'
import {
  PrimaryWrapper,
  PrimaryLabel,
  SecondaryContainer,
  SecondaryButton,
  SecondaryLabel,
} from './action-buttons.styles'

interface ActionButtonsProps {
  primary: any[]
  secondary: any[]
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ primary, secondary }) => {
  const [currentKey, setCurrentKey] = React.useState('')
  // styled-components imported above

  const actionClick = (key: string, onClick: any) => {
    setCurrentKey(key)
    onClick?.()
  }

  return (
    <div>
      {primary?.map((action, index) => (
        <React.Fragment key={`primary-${action.key ?? index}`}>
          <PrimaryWrapper>
            <Button
              onClick={() => actionClick(action.key, action.onClick)}
              color="primary"
              fullWidth
              size="large"
              variant="contained"
              disabled={action.disabled}
              endIcon={action.icon}
            >
              <PrimaryLabel>
                <FormattedMessage id={action.label} />
              </PrimaryLabel>
            </Button>
          </PrimaryWrapper>
          {action.component &&
            React.cloneElement(action.component, {
              open: action.key === currentKey,
              onClose: () => setCurrentKey(''),
            })}
        </React.Fragment>
      ))}
      <SecondaryContainer>
        {secondary?.map((action, index) => (
          <React.Fragment key={`secondary-${action.key ?? index}`}>
            <SecondaryButton
              onClick={() => actionClick(action.key, action.onClick)}
              size="small"
              color="secondary"
              variant="contained"
              disabled={action.disabled}
              fullWidth
              endIcon={action.icon}
            >
              <SecondaryLabel>{action.label}</SecondaryLabel>
            </SecondaryButton>
            {action.component &&
              React.cloneElement(action.component, {
                open: action.key === currentKey,
                onClose: () => setCurrentKey(''),
              })}
          </React.Fragment>
        ))}
      </SecondaryContainer>
    </div>
  )
}

export default ActionButtons
