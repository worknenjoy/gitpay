import React from 'react'
import PropTypes from 'prop-types'
import {
  Redeem as RedeemIcon,
  Lock as PrivateIcon,
  LockOpen as PublicIcon
} from '@material-ui/icons'
import {
  Paper,
  Typography
} from '@material-ui/core'

const styles = {
  IconStyle: {
    fontSize: 48
  },
  fontStyle: {
    fontWeight: '900',
    fontSize: 20,
    marginBottom: 30
  }
}

/* Expects two props
status: String<'public' | 'private'> (You can pass a dynamic property that evaluates
                                      to 'public' or 'private')
bounty: Boolean<true | false>
*/

const TaskStatusIcons = ({ status, bounty }) => {
  const Bounty = () => {
    if (bounty) {
      return (
        <React.Fragment>
          <RedeemIcon style={ styles.IconStyle } />
          <Typography
            style={ styles.fontStyle }>
              Bounty
          </Typography>
        </React.Fragment>
      )
    }
    else return <div />
  }
  const Status = () => {
    if (status) {
      return (
        <React.Fragment>
          { (status === 'private')
            ? (<PrivateIcon style={ styles.IconStyle } />)
            : (<PublicIcon style={ styles.IconStyle } />)
          }
          <Typography
            style={ styles.fontStyle }>
            { (status === 'private') ? 'Private' : 'Public' }
          </Typography>
        </React.Fragment>
      )
    }
    else return <div />
  }
  return (
    <React.Fragment>
      <Paper
        style={ { margin: 'auto', width: '95%' } }
        elevation={ 0 }
        children={
          <React.Fragment>
            <Typography type='subheading' variant='caption' style={ {
              padding: 10,
              color: 'gray',
              textAlign: 'center',
              fontSize: 30
            } }>
                      Task is
            </Typography>
            <p style={ {
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            } }>
              <Bounty />
              <Status />
            </p>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}

TaskStatusIcons.propTypes = {
  status: PropTypes.string.isRequired,
  bounty: PropTypes.bool.isRequired
}

export default TaskStatusIcons
