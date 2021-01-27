import React from 'react'
import PropTypes from 'prop-types'
import {
  Lock as PrivateIcon,
  LockOpen as PublicIcon
} from '@material-ui/icons'

const styles = {
  IconStyle: {
    fontSize: 24,
    marginLeft: 12
  }
}

const TaskStatusIcons = ({ status, bounty }) => {
  const Status = () => {
    if (status) {
      return (
        <React.Fragment>
          { (status === 'private')
            ? (<PrivateIcon style={ styles.IconStyle } />)
            : (<PublicIcon style={ styles.IconStyle } />)
          }
        </React.Fragment>
      )
    }
    else return <div />
  }
  return (
    <React.Fragment>
      <span>
        <Status />
      </span>
    </React.Fragment>
  )
}

TaskStatusIcons.propTypes = {
  status: PropTypes.string.isRequired,
  bounty: PropTypes.bool.isRequired
}

export default TaskStatusIcons
