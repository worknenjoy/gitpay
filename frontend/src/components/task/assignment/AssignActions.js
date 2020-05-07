import React, { useState, useEffect } from 'react'
import RemoveAssignment from './RemoveAssignment'
import MessageAssignment from './messageAssignment'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  TextField
} from '@material-ui/core'

import {
  HowToReg as GroupWorkIcon,
  Message as MessageIcon
} from '@material-ui/icons'

const ModalReason = ({ callback, open, setOpen }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    callback(message)
    setOpen(false)
  }

  return (
    <Dialog
      open={ open }
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        <FormattedMessage id='task.assignment.assign.reject' defaultMessage='Reject Offer' />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography component='div'>
            <FormattedMessage id='task.assignment.reject.reason' defaultMessage="Please explain why don't you want to accept this offer anymore" />
          </Typography>
        </DialogContentText>
        <TextField
          onChange={ (e) => setMessage(e.target.value) }
          autoFocus
          name='message'
          multiline
          rows='3'
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={ () => setOpen(false) } color='primary'>
          <FormattedMessage id='task.assignment.actions.cancel' defaultMessage='Cancel' />
        </Button>
        <Button disabled={ message.length === 0 }
          onClick={ handleSubmit } variant='contained' color='secondary' >
          <FormattedMessage id='task.assignment.actions.reject' defaultMessage='Reject' />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const AssignActions = ({ hash, actionAssign, loggedUser, isOwner, assign, task, removeAssignment, assignTask, messageTask }) => {
  const hasAssignedUser = assign.id === task.assigned
  const [ messageOpen, setMessageOpen ] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)

  useEffect(() => {
    if (loggedUser && assign && task) {
      if (loggedUser.id === assign.userId && assign.status === 'pending-confirmation' && hash === '#accept') {
        handleAssign(task.id, assign.id, assign.id, true)
      }
    }
  }, [])

  useEffect(() => {
    if (hash === '#reject' && task && assign && loggedUser && assign.status === 'pending-confirmation') {
      setRejectModal(true)
    }
  }, [loggedUser, assign, task])

  const handleAssign = (taskId, assignId, accept, message = null) => {
    actionAssign(taskId, assignId, accept, message)
  }

  return (
    <div>
      {
        <ModalReason callback={ (message) => handleAssign(task.id, assign.id, false, message) } open={ rejectModal } setOpen={ setRejectModal } />
      }
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
          <MessageIcon style={ { marginLeft: 5, marginRight: 5 } } />
        </Button>
      }
      <RemoveAssignment
        task={ task }
        remove={ removeAssignment }
        visible={ hasAssignedUser && isOwner }
      />
      { (isOwner && !hasAssignedUser) &&
      <Button
        disabled={ hasAssignedUser }
        onClick={ () => assignTask(task.id, assign.id) }
        style={ { marginRight: 10 } }
        variant='contained'
        size='small'
        color='primary'
      >
        { assign.status !== 'pending'
          ? <FormattedMessage id='task.actions.choose.rejected' defaultMessage='Re-send Invite' />
          : <FormattedMessage id='task.actions.choose' defaultMessage='choose' />
        }
        <GroupWorkIcon style={ { marginLeft: 5 } } />
      </Button>
      }
      {
        (() => {
          // FIXME: not updating page after button
          if (hasAssignedUser) {
            if (assign.status === 'accepted') {
              return (<FormattedMessage id='task.payment.action.chosen' defaultMessage='Chosen' >
                { (msg) => (
                  <Chip label={ msg } />
                ) }
              </FormattedMessage>)
            }
          }
          else if (loggedUser.id === assign.userId && assign.status === 'pending-confirmation') {
            return (['Accept', 'Reject'].map(action => (<Button
              onClick={ action === 'Accept'
                ? () => handleAssign(task.id, assign.id, true)
                : () => setRejectModal(true)
              }
              style={ { marginRight: 10 } }
              variant='contained'
              size='small'
              color='primary'
            > { action } </Button>)
            ))
          }
          else if (isOwner && assign.status === 'pending-confirmation') {
            return (<FormattedMessage id='task.payment.action.pendingConfirmation' defaultMessage='Pending User Confirmation' >
              { (msg) => (
                <Chip label={ msg } />
              ) }
            </FormattedMessage>)
          }
          else if ((isOwner || (loggedUser.id === assign.userId)) && (assign.status === 'rejected')) {
            return (<FormattedMessage id='task.payment.action.rejected' defaultMessage='Rejected by User' >
              { (msg) => (
                <Chip label={ msg } />
              ) }
            </FormattedMessage>)
          }
        })()
      }
    </div>
  )
}

export default AssignActions
