import React from 'react'
import RemoveAssignment from './RemoveAssignment'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Chip
} from '@material-ui/core'

import {
  HowToReg as GroupWorkIcon
} from '@material-ui/icons'

const AssignActions = ({ isOwner, assign, task, removeAssignment, assignTask }) => {
  const hasAssignedUser = assign.id === task.assigned
  const approved_by_user = assign.status !== 'approved_by_interested'

  return (
    <div>
      <RemoveAssignment
        task={ task }
        remove={ removeAssignment }
        visible={ hasAssignedUser && isOwner }
      />

      { (isOwner && !hasAssignedUser) &&
      <Button
        disabled={ hasAssignedUser || approved_by_user }
        onClick={ () => assignTask(task.id, assign.id) }
        style={ { marginRight: 10 } }
        variant='contained'
        size='small'
        color='primary'
      >
        <GroupWorkIcon style={ { marginRight: 5 } } />
        <FormattedMessage id='task.actions.choose' defaultMessage='choose' />
      </Button>
      }

      { hasAssignedUser &&
      <FormattedMessage id='task.payment.action.chosen' defaultMessage='Chosen' >
        { (msg) => (
          <Chip label={ msg } />
        ) }
      </FormattedMessage>
      }
    </div>
  )
}

export default AssignActions
