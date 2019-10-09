import React, { useState } from 'react'
import RemoveAssignment from './RemoveAssignment'
import MessageAssignment from './messageAssignment'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Chip
} from '@material-ui/core'

import {
  HowToReg as GroupWorkIcon,
  Message as MessageIcon
} from '@material-ui/icons'

const AssignActions = ({ isOwner, assign, task, removeAssignment, assignTask, messageTask }) => {
  const hasAssignedUser = assign.id === task.assigned
  const [ messageOpen, setMessageOpen ] = useState(false)

  return (
    <div>
      <RemoveAssignment
        task={ task }
        remove={ removeAssignment }
        visible={ hasAssignedUser && isOwner }
      />

      <MessageAssignment
        assign={ assign }
        task={ task }
        messageAction={ messageTask }
        visible={ messageOpen }
        onClose={ () => setMessageOpen(false) }
      />
      { isOwner && 
        <Button
        onClick={ () => setMessageOpen(true) }
        style={ { marginRight: 10 } }
        variant='contained'
        size='small'
        color='primary'
        >
          <FormattedMessage id='task.actions.message' defaultMessage='Send message' />
          <MessageIcon style={ { marginLeft: 5 } } />
        </Button>
      }
      { (isOwner && !hasAssignedUser) &&
          <Button
            disabled={ hasAssignedUser }
            onClick={ () => assignTask(task.id, assign.id) }
            style={ { marginRight: 10 } }
            variant='contained'
            size='small'
            color='primary'
          >
            <FormattedMessage id='task.actions.choose' defaultMessage='choose' />
            <GroupWorkIcon style={ { marginLeft: 5 } } />
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
