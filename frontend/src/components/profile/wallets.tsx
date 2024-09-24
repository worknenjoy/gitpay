import React, { useState, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from '../task/messages/task-messages'

import {
  Container,
  Button,
  Typography
} from '@material-ui/core'

import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

import { FormattedMessage, injectIntl } from 'react-intl'
import CustomPaginationActionsTable from './payments-table'
import AddFundsFormDrawer from './components/payments/add-funds-form-drawer'

const paymentMessages = defineMessages({
  paymentTabIssue: {
    id: 'payment.table.header.payment.issue',
    defaultMessage: 'Payments for issues'
  },
  paymentTabFund: {
    id: 'payment.table.header.payment.funds',
    defaultMessage: 'Payments for funds'
  },
})

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
      textAlign: 'left',
      color: theme.palette.text.secondary
    },
    button: {
      width: 100,
      fontSize: 10
    },
    icon: {
      marginLeft: 5
    }
  })

const Wallets = ({ classes, intl, user, customer, fetchCustomer, wallets }) => {
  const [addFundsDialog, setAddFundsDialog] = useState(false)

  const openAddFundsDialog = (e) => {
    e.preventDefault()
    setAddFundsDialog(true)
  }

  useEffect(() => {
    const userId = user.id
    userId && fetchCustomer(userId)
  }, [user])

  return (
    <div style={{ marginTop: 40 }}>
      <AddFundsFormDrawer
        open={addFundsDialog}
        onClose={() => setAddFundsDialog(false)}
        customer={customer}
      />
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h5' gutterBottom>
            <FormattedMessage id='general.wallets' defaultMessage='Wallets' />
          </Typography>
          <div>
            <Button
              variant='contained'
              size='small'
              color='secondary'
              className={classes.button}
              onClick={(e) => openAddFundsDialog(e)}
            >
              <FormattedMessage id='general.payments.add' defaultMessage='Add funds' />
            </Button>
          </div>
        </div>
        <div style={{ marginTop: 10, marginBottom: 30 }}>
          <CustomPaginationActionsTable
            tableHead={[
              intl.formatMessage(messages.cardTableHeaderPaid),
              intl.formatMessage(messages.cardTableHeaderStatus),
              intl.formatMessage(messages.cardTableHeaderIssue),
              intl.formatMessage(messages.cardTableHeaderValue),
              intl.formatMessage(messages.cardTableHeaderPayment),
              intl.formatMessage(messages.cardTableHeaderCreated),
              intl.formatMessage(messages.cardTableHeaderActions)
            ]}
            payments={{
              data: [],
              completed: true
            }}
          />
        </div>
      </Container>
    </div>
  )
}

export default injectIntl(withStyles(styles)(Wallets))
