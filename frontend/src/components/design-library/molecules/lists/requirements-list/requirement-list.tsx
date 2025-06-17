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
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
root: {
    width: '100%',
    maxWidth: 500
  }
}))

const CustomPlaceholder = () => <CircularProgress size={24} />
const SendSolutionRequirements = ({ requirements, completed }) => {
  const classes = useStyles()

  return (
    <List className={ classes.root }>
      { requirements.map((requirement, index) => (
        <ListItem>
          <ListItemIcon style={ { color: 'black' } }>
            <ReactPlaceholder showLoadingAnimation ready={ completed } customPlaceholder={ <CustomPlaceholder /> }>
              { requirement.done ? <CheckCircleRoundedIcon color="primary" /> : <CancelRoundedIcon /> }
            </ReactPlaceholder>
          </ListItemIcon>
          <ListItemText primary={requirement.label} />
      </ListItem>
      )) }
    </List>
  )
}

export default SendSolutionRequirements
