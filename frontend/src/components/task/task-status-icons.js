import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
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
    fontSize: 24,
    marginLeft: 12
  }
}

/* Expects two props
status: String<'public' | 'private'> (You can pass a dynamic property that evaluates
                                      to 'public' or 'private')
bounty: Boolean<true | false>
*/

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
