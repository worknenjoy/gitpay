import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { FormattedMessage } from 'react-intl'
// No local styles hook; using default MUI spacing

export default function ImportIssueButton({ onAddIssueClick }) {
  const anchorRef = React.useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    onAddIssueClick()
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%">
      <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick}>
          <FormattedMessage
            id="home.hero.headline.button.secondary"
            defaultMessage="Import issue"
          />
        </Button>
      </ButtonGroup>
    </Box>
  )
}
