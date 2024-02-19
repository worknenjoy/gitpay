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
  const { data } = order
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
                label={ data && data.status ? data.status : 'canceled' }
              />
            </div>
            <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
              <Typography variant='body1'>
                <FormattedMessage id='task.bounties.order.details.provider' defaultMessage='Provider:' />
              </Typography>
              <Typography variant='body1'>
                { data && data.provider ? data.provider : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
              </Typography>
            </div>
            <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
              <Typography variant='body1'>
                <FormattedMessage id='task.bounties.order.details.id' defaultMessage='Order ID:' />
              </Typography>
              <Typography variant='body1'>
                { data && data.source_id ? data.source_id : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
              </Typography>
            </div>
            <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
              <Typography variant='body1'>
                <FormattedMessage id='task.bounties.order.details.authorization_id' defaultMessage='Authorization ID:' />
              </Typography>
              <Typography variant='body1'>
                { data && data.authorization_id ? data.authorization_id : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
              </Typography>
            </div>
            { order && order.provider && (order.provider === 'paypal') &&
            <React.Fragment>
              <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
                <Typography variant='body1'>
                  <FormattedMessage id='task.bounties.order.details.created' defaultMessage='Created:' />
                </Typography>
                <Typography variant='body1'>
                  { data && data.paypal ? MomentComponent(data.paypal.created_at).fromNow() : ' - ' }
                </Typography>
              </div>
              <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
                <Typography variant='body1'>
                  <FormattedMessage id='task.bounties.order.details.intent' defaultMessage='Intent:' />
                </Typography>
                <Typography variant='body1'>
                  { data && data.paypal ? data.paypal.intent : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
                </Typography>
              </div>
              <div style={ { marginBottom: 20, width: '30%', marginRight: 20 } }>
                <Typography variant='body1'>
                  <FormattedMessage id='task.bounties.order.details.status' defaultMessage='Status:' />
                </Typography>
                <Typography variant='body1'>
                  { data && data.paypal ? data.paypal.status : <FormattedMessage id='general.messages.missing' defaultMessage='Not found' /> }
                </Typography>
              </div>
            </React.Fragment>
            }
          </div>
        </DialogContent>
        <DialogActions>
          { data && data.status !== 'canceled' && data.paypal && (data.paypal.status === 'APPROVED' || data.paypal.status === 'COMPLETED') &&
          <Button onClick={ (e) => onCancel(e, data.id) } variant='contained' color='secondary'>
            <FormattedMessage id='task.bounties.order.details.action.cancel' defaultMessage='Cancel payment authorization' />
          </Button>
          }
          { data && data.payment_url && data.status !== 'succeeded' &&
            <Button variant='contained' onClick={ (e) => {
              window.location.href = data.payment_url
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
