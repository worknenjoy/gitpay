import React, { useState, useEffect } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from '../task/messages/task-messages'
import {
  Container,
  Button,
  Typography
} from '@material-ui/core'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import moment from 'moment'

import CustomPaginationActionsTable from './wallets-table'
import AddFundsFormDrawer from './components/payments/add-funds-form-drawer'
import BalanceCard from '../design-library/molecules/balance-card/balance-card'
import WalletForm from './components/wallets/wallet-form'

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

const Wallets = ({
  classes,
  intl,
  user,
  customer,
  fetchCustomer,
  wallets,
  createWallet,
  listWallets,
  createWalletOrder,
  listWalletOrders,
  walletOrders,
  walletOrder,
  fetchWalletOrder
}) => {
  const [addFundsDialog, setAddFundsDialog] = useState(false)
  const [showWalletName, setShowWalletName] = useState(false)
  const [walletName, setWalletName] = useState('Default wallet')

  const openAddFundsDialog = (e) => {
    e.preventDefault()
    setAddFundsDialog(true)
  }

  const createWalletName = () => {
    setShowWalletName(true)
  }

  const confirmWalletCreate = async () => {
    await createWallet({
      name: walletName,
    })
    await listWallets(user.id)
  }

  const payFunds = async (price) => {
    const walletId = wallets.data[0]?.id
    await createWalletOrder({
      walletId,
      amount: price
    })
    await listWalletOrders(walletId)
    setAddFundsDialog(false)
  }

  const handleInvoicePayment = async (walletOrderId) => {
    await fetchWalletOrder(walletOrderId)
    const invoice = walletOrder?.data?.invoice
    if(invoice?.hosted_invoice_url) {
      window.location.href = invoice.hosted_invoice_url
    }
  }

  useEffect(() => {
    const userId = user.id
    userId && listWallets(userId)
    userId && fetchCustomer(userId)
  }, [user])

  useEffect(() => {
    const walletId = wallets.data[0]?.id
    walletId && listWalletOrders(walletId)
  }, [wallets, createWalletOrder])

  return (
    <div style={{ marginTop: 40 }}>
      <AddFundsFormDrawer
        open={addFundsDialog}
        onClose={() => setAddFundsDialog(false)}
        customer={customer}
        onPay={payFunds}
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
        </div>
        {wallets.data && wallets.data.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            {wallets.data.map((wallet, index) => (
              <ReactPlaceholder type='text' rows={2} ready={wallets.completed} key={index}>
                <BalanceCard
                  name={wallet.name || `Wallet #${index + 1}`} balance={wallet.balance}
                  onAdd={(e) => openAddFundsDialog(e)}
                />
              </ReactPlaceholder>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
            <div className={classes.paper}>
              {showWalletName ? (
                <WalletForm
                  value={walletName}
                  onChange={setWalletName}
                  onCreate={confirmWalletCreate}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Typography variant='body1' gutterBottom>
                    <FormattedMessage id='general.wallets.empty' defaultMessage='You dont have any active wallet' />
                  </Typography>
                  <Button style={{ marginTop: 12 }} onClick={createWalletName} variant='contained' size='large' color='secondary' className={classes.button}>
                    <FormattedMessage id='general.wallets.create' defaultMessage='Create wallet' />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        {wallets.data && wallets.data.length > 0 && (
          <div style={{ marginTop: 10, marginBottom: 30 }}>
            <CustomPaginationActionsTable
              tableHead={[
                intl.formatMessage(messages.cardTableHeaderStatus),
                intl.formatMessage(messages.cardTableHeaderValue),
                intl.formatMessage(messages.cardTableHeaderCreated),
                intl.formatMessage(messages.cardTableHeaderActions)
              ]}
              walletOrders={
                walletOrders && walletOrders.data &&
                {
                  ...walletOrders,
                  data: walletOrders?.data?.map(wo => [
                    wo.status,
                    `$ ${wo.amount}`,
                    moment(wo.createdAt).format('LLL'),
                    <>
                      {(wo.status === 'open') &&
                        <Button onClick={(e) => handleInvoicePayment(wo.id)} variant='contained' color='secondary' size='small'>
                          <FormattedMessage id='general.wallets.table.actions.pay' defaultMessage='Pay invoice' />
                        </Button>
                      }
                    </>
                  ])
                } || {}
              }
            />
          </div>
        )}
      </Container>
    </div>
  )
}

export default injectIntl(withStyles(styles)(Wallets))
