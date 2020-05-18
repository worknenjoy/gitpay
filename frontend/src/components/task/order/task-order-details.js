import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button
} from '@material-ui/core'

import MomentComponent from 'moment'

const TaskOrderDetails = ({ open, order, onClose, onCancel }) => {
  return (
    <Dialog
      open={ open }
      onClose={ onClose }
      aria-labelledby='form-dialog-title'
    >
      <div>
        <DialogTitle id='form-dialog-title'>
          <FormattedMessage id='task.bounties.order.details.title' defaultMessage='Order details' />
        </DialogTitle>
        <DialogContent>
          <Typography type='caption'>
            <FormattedMessage id='task.bounties.order.details.message' defaultMessage='We have here more info about your order' />
          </Typography>
          <div style={ { display: 'flex', flexWrap: 'wrap', marginTop: 10, justifyContent: 'space-between' } }>
            <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
              <Typography variant='body1'>
                <FormattedMessage id='task.bounties.order.details.status' defaultMessage='Status:' />
              </Typography>
              <Chip
                label={ order && order.status ? order.status : 'canceled' }
              />
            </div>
            <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
              <Typography variant='body1'>
                <FormattedMessage id='task.bounties.order.details.provider' defaultMessage='Provider:' />
              </Typography>
              <Typography variant='body1'>
                { order && order.provider ? order.provider : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
              </Typography>
            </div>
            <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
              <Typography variant='body1'>
                <FormattedMessage id='task.bounties.order.details.id' defaultMessage='Order ID:' />
              </Typography>
              <Typography variant='body1'>
                { order && order.source_id ? order.source_id : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
              </Typography>
            </div>
            <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
              <Typography variant='body1'>
                <FormattedMessage id='task.bounties.order.details.authorization_id' defaultMessage='Authorization ID:' />
              </Typography>
              <Typography variant='body1'>
                { order && order.authorization_id ? order.authorization_id : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
              </Typography>
            </div>
            { order && order.provider && (order.provider === 'paypal') &&
            <React.Fragment>
              <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
                <Typography variant='body1'>
                  <FormattedMessage id='task.bounties.order.details.created' defaultMessage='Created:' />
                </Typography>
                <Typography variant='body1'>
                  { order && order.paypal ? MomentComponent(order.paypal.created_at).fromNow() : ' - ' }
                </Typography>
              </div>
              <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
                <Typography variant='body1'>
                  <FormattedMessage id='task.bounties.order.details.intent' defaultMessage='Intent:' />
                </Typography>
                <Typography variant='body1'>
                  { order && order.paypal ? order.paypal.intent : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
                </Typography>
              </div>
              <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
                <Typography variant='body1'>
                  <FormattedMessage id='task.bounties.order.details.status' defaultMessage='Status:' />
                </Typography>
                <Typography variant='body1'>
                  { order && order.paypal ? order.paypal.status : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
                </Typography>
              </div>
            </React.Fragment>
            }
          </div>
        </DialogContent>
        <DialogActions>
          { order && order.status !== 'canceled' && order.paypal && (order.paypal.status === 'APPROVED' || order.paypal.status === 'COMPLETED') &&
          <Button onClick={ (e) => onCancel(e, order.id) } variant='contained' color='secondary'>
            <FormattedMessage id='task.bounties.order.details.action.cancel' defaultMessage='Cancel payment authorization' />
          </Button>
          }
          { order && order.payment_url &&
            <Button variant='contained' onClick={ (e) => {
              window.location.href = order.payment_url
            } } color='secondary'>
              <FormattedMessage id='general.buttons.retry' defaultMessage='Retry' />
            </Button>
          }
          <Button onClick={ onClose } variant='contained' color='secondary' >
            <FormattedMessage id='general.buttons.close' defaultMessage='Close' />
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default TaskOrderDetails
