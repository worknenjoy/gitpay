import React from 'react'
import PropTypes from 'prop-types'
import { Chip } from '@material-ui/core'
import {
  Lock as PrivateIcon,
  LockOpen as PublicIcon
} from '@material-ui/icons'

const styles = {
  IconStyle: {
    fontSize: 14,
    verticalAlign: 'middle'
  },
  chipStyle: {
    marginLeft: 12,
    marginRight: 12,
    verticalAlign: 'middle',
  }
}

const TaskStatusIcons = ({ status }) => {
  const Status = () => {
    if (status) {
      return (
        <React.Fragment>
          { (status === 'private')
            ? (
              <Chip style={ styles.chipStyle } label='Private' icon={ <PrivateIcon style={ styles.IconStyle } fontSize='small' /> } />
            )
            : (
              <Chip style={ styles.chipStyle } label='Public' icon={ <PublicIcon style={ styles.IconStyle } fontSize='small' /> } />
            )
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
