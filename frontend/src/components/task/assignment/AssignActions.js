import React, { useState, useEffect } from 'react'
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
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  MenuItem
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

const AssignActions = ({ hash, actionAssign, user, loggedUser, isOwner, assign, task, assignTask, messageTask, createOrder }) => {
  const hasAssignedUser = assign.id === task.assigned
  const [ messageOpen, setMessageOpen ] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [checked, setChecked] = useState(false)
  const [offer, setOffer] = React.useState(0)

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

  const handleChangeCheck = (event) => {
    setChecked(event.target.checked)
  }

  const handleChange = (event) => {
    setOffer(event.target.value)
  }

  return (
    <div style={ { marginTop: 10 } }>
      {
        <ModalReason callback={ (message) => handleAssign(task.id, assign.id, false, message) } open={ rejectModal } setOpen={ setRejectModal } />
      }
      { (loggedUser && isOwner) &&
        <React.Fragment>
          <MessageAssignment
            assign={ assign }
            task={ task }
            messageAction={ messageTask }
            visible={ messageOpen }
            onClose={ () => setMessageOpen(false) }
          />
          <Button
            onClick={ () => setMessageOpen(true) }
            variant='contained'
            size='small'
            color='primary'
          >
            <FormattedMessage id='task.actions.message' defaultMessage='Send message' />
            <MessageIcon style={ { marginLeft: 5, marginBottom: 5 } } />
          </Button>
        </React.Fragment>
      }
      { (isOwner && !hasAssignedUser) &&
      <Button
        disabled={ hasAssignedUser }
        onClick={ async (e) => {
          e.preventDefault()
          assignTask(task.id, assign.id)
          checked && task.id && loggedUser.id && await createOrder({
            provider: 'stripe',
            amount: offer,
            userId: loggedUser.id,
            email: loggedUser.email,
            taskId: task.id,
            currency: 'usd',
            status: 'open',
            source_type: 'invoice-item',
            customer_id: loggedUser.customer_id
          })
        } }
        variant='contained'
        size='small'
        color='primary'
        style={ { marginLeft: 5 } }
      >
        { assign.status !== 'pending'
          ? <FormattedMessage id='task.actions.choose.rejected' defaultMessage='Re-send Invite' />
          : <FormattedMessage id='task.actions.choose' defaultMessage='choose' />
        }
        <GroupWorkIcon style={ { marginLeft: 5, marginBottom: 5 } } />
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
      { isOwner && task.id && loggedUser.id &&
        <div style={ { marginTop: 10, marginBottom: 10, marginLeft: 20 } }>
          <FormGroup row>
            <FormControlLabel
              control={ <Checkbox checked={ checked } onChange={ handleChangeCheck } name='checked' /> }
              label={
                <div style={ { display: 'flex', alignItems: 'flex-start', flexDirection: 'column' } }>
                  <FormattedMessage id='task.offer.invoice.create' defaultMessage='Create order' />
                  { checked &&
                  <TextField
                    id='standard-select-currency'
                    select
                    label='Select'
                    value={ offer }
                    onChange={ handleChange }
                    helperText='Select offers'
                    style={ { marginTop: 10 } }
                  >
                    { task && task.Offers && task.Offers.map((option) => (
                      <MenuItem key={ option.id } value={ option.value }>
                        ${ option.value } - { option.comment }
                      </MenuItem>
                    )) }
                  </TextField> }
                </div>
              }
            />
          </FormGroup>
        </div>
      }
    </div>
  )
}

export default AssignActions
