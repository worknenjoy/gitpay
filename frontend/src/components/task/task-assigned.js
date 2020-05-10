import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import nameInitials from 'name-initials'
import MomentComponent from 'moment'
import classNames from 'classnames'

import {
  withStyles,
  Avatar,
  Typography,
  Tooltip,
  Card,
  CardHeader,
  Chip
} from '@material-ui/core'
import UserIcon from '@material-ui/icons/AccountCircle'

import AssignActions from './assignment/AssignActions'

const styles = theme => ({
  main: {
    marginTop: 10,
    marginBottom: 10
  }
})

class TaskAssigned extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  static propTypes = {
    task: PropTypes.object,
    isOwner: PropTypes.bool,
    status: PropTypes.string,
    classes: PropTypes.object,
    user: PropTypes.object,
    removeAssignment: PropTypes.func,
    assignTask: PropTypes.func
  }

  pickTaskPrice = (price) => {

  }

  handleInputChange = (e) => {
    // this.setState({ currentPrice: e.target.value })
  }

  handlePayment = (value) => {

  }

  render () {
    const { user, classes, status, isOwner, task, assign, removeAssignment, assignTask } = this.props
    const updatedAtTimeString = MomentComponent(user.updated_at).utc().format('DD/MM/YYYY hh:mm A')
    const timePlaceholder = (
      <Typography type='subheading' style={ { padding: 25, color: 'gray' } }>
        { updatedAtTimeString }
      </Typography>
    )

    return (
      <div className={ classes.main }>
        <Card raised={ false }>
          <CardHeader
            avatar={
              <FormattedMessage id='task.assigned.status.name' defaultMessage='Assigned to {name}' values={ {
                name: user.name || user.username
              } }>
                { (msg) => (
                  <Tooltip
                    id='tooltip-github'
                    title={ msg }
                    placement='bottom'
                  >
                    <a
                      href={ `${user.profile_url || user.website || '#'}` }
                      target='_blank'
                    >
                      { user.picture_url &&
                        <Avatar
                          alt={ user.username || '' }
                          src={ user.picture_url }
                        />
                      }

                      { !user.picture_url &&
                        <Avatar className={ classNames(classes.avatar) } alt={ user.username || '' } src=''>
                          { user.username ? nameInitials(user.username) : <UserIcon /> }
                        </Avatar>
                      }
                    </a>
                  </Tooltip>
                ) }
              </FormattedMessage>
            }
            title={ user.user || user.username }
            subheader={
              <div>
                <FormattedMessage id='task.assigned.status.name.create' defaultMessage='Assigned to {name}' values={ {
                  name: user.name || user.username
                } } />
                <Chip
                  style={ { marginRight: 10 } }
                  label={ status }
                  className={ classes.chipStatus }
                />
                { isOwner && <AssignActions logged={ isOwner } isOwner={ isOwner } assign={ assign } task={ task } removeAssignment={ removeAssignment } assignTask={ assignTask } /> }
              </div>
            }
            action={
              timePlaceholder
            }
          />
        </Card>

      </div>
    )
  }
}

export default withStyles(styles)(TaskAssigned)
