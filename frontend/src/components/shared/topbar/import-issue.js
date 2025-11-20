import React from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { FormattedMessage } from 'react-intl'

export default function ImportIssueButton({ onAddIssueClick, classes }) {
  const anchorRef = React.useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    onAddIssueClick()
  }

  return (
    <Grid container direction="column" alignItems="center">
      <Grid size={{ xs: 12 }}>
        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
          <Button onClick={handleClick} className={classes?.actionButtons}>
            <FormattedMessage
              id="home.hero.headline.button.secondary"
              defaultMessage="Import issue"
            />
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}
