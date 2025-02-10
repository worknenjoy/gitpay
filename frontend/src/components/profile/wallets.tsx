import React, { useState, useEffect, useCallback } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from '../task/messages/task-messages'
import {
  Container,
  Button,
  Typography
} from '@material-ui/core'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { FormattedMessage, useIntl } from 'react-intl'
import moment from 'moment'

import CustomPaginationActionsTable from './wallets-table'
import AddFundsFormDrawer from './components/payments/add-funds-form-drawer'
import BalanceCard from '../design-library/molecules/balance-card/balance-card'
import WalletForm from './components/wallets/wallet-form'
import InvoiceStatus from '../design-library/atoms/invoice-status/invoice-status'
import InvoiceId from './wallets/invoice-id'
import { formatCurrency } from '../../utils/format-currency'
import InvoiceDueDate from './wallets/invoice-due-date'

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
  fetchWalletOrder,
  wallet,
  fetchWallet
}) => {
  const intl = useIntl()
  const [addFundsDialog, setAddFundsDialog] = useState(false)
  const [showWalletName, setShowWalletName] = useState(false)
  const [walletName, setWalletName] = useState('Default wallet')
  const [gotToInvoicePayment, setGoToInvoicePayment] = useState(false)
  const [downloadInvoice, setDownloadInvoice] = useState(false)

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
    setGoToInvoicePayment(true)
  }

  const downloadInvoicePayment = async (walletOrderId) => {
    await fetchWalletOrder(walletOrderId)
    setDownloadInvoice(true)
  }

  useEffect(() => {
    if (gotToInvoicePayment) {
      const invoice = walletOrder?.data?.invoice
      if (invoice?.hosted_invoice_url) {
        window.location.href = invoice.hosted_invoice_url
      }
    }
  }, [gotToInvoicePayment, walletOrder])

  useEffect(() => {
    if (downloadInvoice) {
      const invoice = walletOrder?.data?.invoice
      if (invoice?.invoice_pdf) {
        window.location.href = invoice.invoice_pdf
      }
    }
  }, [downloadInvoice, walletOrder])

  useEffect(() => {
    const userId = user.id
    userId && listWallets(userId)
    userId && fetchCustomer(userId)
  }, [user])

  useEffect(() => {
    const walletId = wallets.data[0]?.id
    walletId && fetchWallet(walletId)
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
        <ReactPlaceholder type='text' rows={2} ready={wallet.completed}>
          {wallet.data.id ? (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <BalanceCard
                name={wallet.data.name || `Wallet #${wallet.id}`} balance={wallet.data.balance}
                onAdd={(e) => openAddFundsDialog(e)}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
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
                    alignItems: 'center',
                    height: '60vh'
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
        </ReactPlaceholder>
        {wallets.data && wallets.data.length > 0 && (
          <div style={{ marginTop: 10, marginBottom: 30 }}>
            <CustomPaginationActionsTable
              tableHead={[
                intl.formatMessage(messages.cardTableHeaderId),
                intl.formatMessage(messages.cardTableHeaderStatus),
                intl.formatMessage(messages.cardTableHeaderValue),
                intl.formatMessage(messages.cardTableHeaderCreated),
                intl.formatMessage(messages.cardTableHeaderDueDate),
                intl.formatMessage(messages.cardTableHeaderActions)
              ]}
              walletOrders={
                walletOrders && walletOrders.data &&
                {
                  ...walletOrders,
                  data: walletOrders?.data?.map( wo => [
                    <InvoiceId key={wo.id} walletOrderId={wo.id} fetchWalletOrder={fetchWalletOrder} />,
                    <InvoiceStatus invoiceStatus={wo.status} />,
                    formatCurrency(wo.amount),
                    moment(wo.createdAt).fromNow(),
                    <InvoiceDueDate key={wo.id} walletOrderId={wo.id} fetchWalletOrder={fetchWalletOrder} />,
                    <>
                      {(wo.status === 'open') &&
                        <Button onClick={(e) => handleInvoicePayment(wo.id)} variant='contained' color='secondary' size='small'>
                          <FormattedMessage id='general.wallets.table.actions.pay' defaultMessage='Pay invoice' />
                        </Button>
                      }
                      {(wo.status === 'paid') &&
                        <Button onClick={(e) => downloadInvoicePayment(wo.id)} variant='contained' color='secondary' size='small'>
                          <FormattedMessage id='general.wallets.table.actions.download' defaultMessage='Download invoice' />
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

export default withStyles(styles)(Wallets)
