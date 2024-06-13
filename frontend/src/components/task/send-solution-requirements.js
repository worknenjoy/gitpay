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
import ReactPlaceholder from 'react-placeholder'
import CircularProgress from '@material-ui/core/CircularProgress'

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
          <ReactPlaceholder showLoadingAnimation rows={ 1 } ready={ props.completed } customPlaceholder={ <CircularProgress size={ 24 } /> }>
            { props.isConnectedToGitHub ? <CheckCircleRoundedIcon color='primary' /> : <CancelRoundedIcon /> }
          </ReactPlaceholder>
        </ListItemIcon>
        <ListItemText primary="You're connected to GitHub" />
      </ListItem>
      <ListItem>
        <ListItemIcon style={ { color: 'black' } }>
          <ReactPlaceholder showLoadingAnimation rows={ 1 } ready={ props.completed } customPlaceholder={ <CircularProgress size={ 24 } /> }>
            { props.isAuthorOfPR ? <CheckCircleRoundedIcon color='primary' /> : <CancelRoundedIcon /> }
          </ReactPlaceholder>
        </ListItemIcon>
        <ListItemText primary="You're the author of this Pull Request on GitHub" />
      </ListItem>
      <ListItem>
        <ListItemIcon style={ { color: 'black' } }>
          <ReactPlaceholder showLoadingAnimation rows={ 1 } ready={ props.completed } customPlaceholder={ <CircularProgress size={ 24 } /> }>
            { props.isPRMerged ? <CheckCircleRoundedIcon color='primary' /> : <CancelRoundedIcon /> }
          </ReactPlaceholder>
        </ListItemIcon>
        <ListItemText primary='The Pull Request / Merge Request was merged' />
      </ListItem>
      <ListItem>
        <ListItemIcon style={ { color: 'black' } }>
          <ReactPlaceholder showLoadingAnimation rows={ 1 } ready={ props.completed } customPlaceholder={ <CircularProgress size={ 24 } /> }>
            { props.isIssueClosed ? <CheckCircleRoundedIcon color='primary' /> : <CancelRoundedIcon /> }
          </ReactPlaceholder>
        </ListItemIcon>
        <ListItemText primary='The issue is closed on GitHub' />
      </ListItem>
      <ListItem>
        <ListItemIcon style={ { color: 'black' } }>
          <ReactPlaceholder showLoadingAnimation rows={ 1 } ready={ props.completed } customPlaceholder={ <CircularProgress size={ 24 } /> }>
            { props.hasIssueReference ? <CheckCircleRoundedIcon color='primary' /> : <CancelRoundedIcon /> }
          </ReactPlaceholder>
        </ListItemIcon>
        <ListItemText primary='The issue is referenced on the PR' />
      </ListItem>
    </List>
  )
}

export default SendSolutionRequirements
