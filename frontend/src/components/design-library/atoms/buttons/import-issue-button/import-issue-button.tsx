import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { FormattedMessage } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  actionButtons: {
    
  }
}))

export default function ImportIssueButton ({
  onAddIssueClick
}) {
  const classes = useStyles()
  const anchorRef = React.useRef(null)
  
  const handleClick = (e) => {
    e.preventDefault()
    onAddIssueClick()
  }

  return (
    <Grid container direction='column' alignItems='center'>
      <Grid item xs={ 12 }>
        <ButtonGroup variant='contained' color='primary' ref={ anchorRef } aria-label='split button'>
          <Button onClick={ handleClick } className={classes?.actionButtons}>
            <FormattedMessage
              id='home.hero.headline.button.secondary'
              defaultMessage='Import issue'
            />
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}
