import React from 'react'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
  },
}))

const SendSolutionRequirements = props => {
  const classes = useStyles()

  return (
    <List className={ classes.root }>
      <ListItem>
        <ListItemIcon style={ { color: 'black' } }>
          { props.isConnectedToGitHub ? <CheckCircleRoundedIcon /> : <CancelRoundedIcon /> }
        </ListItemIcon>
        <ListItemText primary="You're connected to GitHub" />
      </ListItem>
      <ListItem>
        <ListItemIcon style={ { color: 'black' } }>
          { props.isAuthorOfPR ? <CheckCircleRoundedIcon /> : <CancelRoundedIcon /> }
        </ListItemIcon>
        <ListItemText primary="You're the author of this Pull Request on GitHub" />
      </ListItem>
      <ListItem>
        <ListItemIcon style={ { color: 'black' } }>
          { props.isPRMerged ? <CheckCircleRoundedIcon /> : <CancelRoundedIcon /> }
        </ListItemIcon>
        <ListItemText primary='The Pull Request / Merge Request was merged' />
      </ListItem>
      <ListItem>
        <ListItemIcon style={ { color: 'black' } }>
          { props.isIssueClosed ? <CheckCircleRoundedIcon /> : <CancelRoundedIcon /> }
        </ListItemIcon>
        <ListItemText primary='The issue is closed on GitHub' />
      </ListItem>
    </List>
  )
}

export default SendSolutionRequirements
