import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Drawer, Typography, Button } from '@mui/material'
import DetailsList from 'design-library/molecules/lists/details-list/details-list'
import ConfirmButton from 'design-library/atoms/buttons/confirm-button/confirm-button'

const IssueOrderDetailsAction = ({ open, order, onClose, onCancel }) => {
  const { data, completed } = order

  const commonOrderDetails = [
    {
      label: <FormattedMessage id="task.bounties.order.details.status" defaultMessage="Status:" />,
      value: data?.status ? data.status : 'canceled',
      valueType: 'chip'
    },
    {
      label: <FormattedMessage id="task.bounties.order.details.provider" defaultMessage="Provider:" />,
      value: data?.provider ? data.provider : <FormattedMessage id="general.messages.missing" defaultMessage="Not found" />
    }
  ]

  const paypalOrderDetails = [
    {
      label: <FormattedMessage id="task.bounties.order.details.status" defaultMessage="Status:" />,
      value: data?.paypal ? data.paypal.status : <FormattedMessage id="paypal.status.canceled" defaultMessage="Canceled" />
    },
    {
      label: <FormattedMessage id="task.bounties.order.details.order_id" defaultMessage="Order ID:" />,
      value: data?.source_id ? data.source_id : <FormattedMessage id="general.messages.missing" defaultMessage="Not found" />
    },
    {
      label: <FormattedMessage id="task.bounties.order.details.authorization_id" defaultMessage="Authorization ID:" />,
      value: data?.authorization_id ? data.authorization_id : <FormattedMessage id="general.messages.missing" defaultMessage="Not found" />
    }
  ]

  const stripeOrderDetails = [
    {
      label: <FormattedMessage id="task.bounties.order.details.id" defaultMessage="Order ID:" />,
      value: data && data.source_id ? data.source_id : <FormattedMessage id="general.messages.missing" defaultMessage="Not found" />
    }
  ]

  return (
    <Drawer anchor="right" open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <div style={{ padding: 20 }}>
        <Typography variant="h5">
          <FormattedMessage id="task.bounties.order.details.title" defaultMessage="Order details" />
        </Typography>
        <div>
          <Typography variant="caption">
            <FormattedMessage
              id="task.bounties.order.details.message"
              defaultMessage="We have here more info about your order"
            />
          </Typography>
          
          <DetailsList 
            completed={completed}
            details={[
              ...commonOrderDetails,
              ...(data && data.provider === 'paypal' ? paypalOrderDetails : []),
              ...(data && data.provider === 'stripe' ? stripeOrderDetails : [])
            ]}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {data &&
            data.status !== 'canceled' &&
            data.paypal &&
            (data.paypal.status === 'APPROVED' || data.paypal.status === 'COMPLETED') && (
              <div style={{ marginRight: 10 }}>
                <ConfirmButton
                  label={
                    <FormattedMessage
                      id="task.bounties.order.details.action.cancel"
                      defaultMessage="Cancel payment authorization"
                    />
                  }
                  dialogMessage={
                    <FormattedMessage
                      id="task.bounties.details.paypal"
                      defaultMessage="Are you sure you want to cancel this pre-payment?"
                    />
                  }
                  alertMessage={
                    <FormattedMessage
                      id="task.bounties.cancel.paypal.caution"
                      defaultMessage="If you cancel this payment, your pre-approved payment will be canceled and the balance will be canceled from this issue"
                    />
                  }
                  onConfirm={(e) => onCancel(e, data.id)}
                  variant="contained"
                  color="secondary"
                />
              </div>
            )}
          {data && data.payment_url && data.status !== 'succeeded' && (
            <Button
              variant="contained"
              onClick={(e) => {
                window.location.href = data.payment_url
              }}
              color="secondary"
              style={{ marginRight: 10 }}
            >
              <FormattedMessage id="general.buttons.retry" defaultMessage="Retry" />
            </Button>
          )}
          <Button onClick={onClose} variant="contained" color="secondary">
            <FormattedMessage id="general.buttons.close" defaultMessage="Close" />
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default IssueOrderDetailsAction