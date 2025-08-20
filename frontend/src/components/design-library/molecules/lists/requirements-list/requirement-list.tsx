import React from 'react'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import { makeStyles } from '@mui/styles'
import CircularProgress from '@mui/material/CircularProgress';

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
            {completed ? (
              requirement.done ? <CheckCircleRoundedIcon color="primary" /> : <CancelRoundedIcon />
            ) : (
              <CustomPlaceholder />
            )}
          </ListItemIcon>
          <ListItemText primary={requirement.label} />
      </ListItem>
      )) }
    </List>
  )
}

export default SendSolutionRequirements
