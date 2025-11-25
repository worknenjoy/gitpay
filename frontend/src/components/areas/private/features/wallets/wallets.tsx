import React, { useState, useEffect } from 'react'
import { messages } from '../../../../../messages/messages'
import { Container, Button, Paper, useTheme, useMediaQuery } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import AddFundsFormDrawer from '../payments/add-funds-form-drawer'
import BalanceCard from 'design-library/molecules/cards/balance-card/balance-card'
import WalletForm from './components/wallet-form'
import InvoiceStatus from 'design-library/atoms/status/payment-types-status/invoice-status/invoice-status'
import InvoiceId from './components/invoice-id'
import { formatCurrency } from '../../../../../utils/format-currency'
import InvoiceDueDate from './components/invoice-due-date'
import EmptyBase from 'design-library/molecules/content/empty/empty-base/empty-base'
import { WalletOutlined } from '@mui/icons-material'
import SectionTable from 'design-library/molecules/tables/section-table/section-table'
import ProfileMainHeader from 'design-library/molecules/headers/profile-main-header/profile-main-header'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'

const classes = {
  paper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left' as const,
    color: 'inherit'
  },
  button: {
    width: 100,
    fontSize: 10
  },
  icon: {
    marginLeft: 5
  }
}

const Wallets = ({
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
      name: walletName
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
        <ProfileMainHeader
          title={<FormattedMessage id="wallets.page.title" defaultMessage="My Wallets" />}
          subtitle={
            <FormattedMessage
              id="wallets.page.description"
              defaultMessage="Manage your wallets and wallet orders"
            />
          }
        />

        {wallet.data.id && wallet.completed ? (
          <div
            style={
              isMobile
                ? { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }
                : { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }
            }
          >
            <BalanceCard
              name={wallet.data.name || `Wallet #${wallet.id}`}
              balance={wallet.data.balance}
              onAdd={(e) => openAddFundsDialog(e)}
              action={<FormattedMessage id="wallets.addFunds" defaultMessage="Add funds" />}
              completed={wallet.completed}
            />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60vh'
            }}
          >
            <div style={classes.paper}>
              {showWalletName ? (
                <WalletForm
                  value={walletName}
                  onChange={setWalletName}
                  onCreate={confirmWalletCreate}
                />
              ) : (
                <Paper style={{ padding: 20 }}>
                  <EmptyBase
                    actionText={
                      <FormattedMessage
                        id="general.wallets.create"
                        defaultMessage="Create wallet"
                      />
                    }
                    text={
                      <FormattedMessage
                        id="general.wallets.empty"
                        defaultMessage="You dont have any active wallet"
                      />
                    }
                    secondaryText={
                      <FormattedMessage
                        id="general.wallets.empty.subtitle"
                        defaultMessage="Create a wallet to start adding funds and making payments using your balance."
                      />
                    }
                    icon={<WalletOutlined />}
                    completed={wallets.completed}
                    onActionClick={createWalletName}
                  />
                </Paper>
              )}
            </div>
          </div>
        )}
        {walletOrders?.data?.length === 0 && walletOrders.completed ? (
          <Paper sx={{ p: 2, mt: 2 }}>
            <EmptyBase
              text={
                <FormattedMessage
                  id="wallets.table.body.noData"
                  defaultMessage="No wallet orders"
                />
              }
              icon={<WalletOutlined />}
              completed={walletOrders.completed}
              actionText={
                <FormattedMessage
                  id="wallets.table.body.noData.action"
                  defaultMessage="Add funds to your wallet"
                />
              }
              onActionClick={(e) => openAddFundsDialog(e)}
            />
          </Paper>
        ) : (
          <div style={{ marginTop: 10, marginBottom: 30 }}>
            <SectionTable
              tableHeaderMetadata={{
                id: { label: intl.formatMessage(messages.cardTableHeaderId) },
                status: { label: intl.formatMessage(messages.cardTableHeaderStatus) },
                value: { label: intl.formatMessage(messages.cardTableHeaderValue) },
                created: { label: intl.formatMessage(messages.cardTableHeaderCreated) },
                dueDate: { label: intl.formatMessage(messages.cardTableHeaderDueDate) },
                actions: { label: intl.formatMessage(messages.cardTableHeaderActions) }
              }}
              tableData={walletOrders}
              customColumnRenderer={{
                status: (item) => <InvoiceStatus status={item.status} completed={item.completed} />,
                value: (item) => formatCurrency(item.amount),
                created: (item) => <CreatedField createdAt={item.createdAt} />,
                dueDate: (item) => (
                  <InvoiceDueDate
                    key={item.id}
                    walletOrderId={item.id}
                    fetchWalletOrder={fetchWalletOrder}
                  />
                ),
                id: (item) => (
                  <InvoiceId
                    key={item.id}
                    walletOrderId={item.id}
                    fetchWalletOrder={fetchWalletOrder}
                  />
                ),
                actions: (item) => (
                  <div style={{ display: 'flex', gap: 10 }}>
                    {item.status === 'open' && (
                      <Button
                        onClick={(e) => handleInvoicePayment(item.id)}
                        variant="contained"
                        color="secondary"
                        size="small"
                      >
                        <FormattedMessage
                          id="general.wallets.table.actions.pay"
                          defaultMessage="Pay invoice"
                        />
                      </Button>
                    )}
                    {item.status === 'paid' && (
                      <Button
                        onClick={(e) => downloadInvoicePayment(item.id)}
                        variant="contained"
                        color="secondary"
                        size="small"
                      >
                        <FormattedMessage
                          id="general.wallets.table.actions.download"
                          defaultMessage="Download invoice"
                        />
                      </Button>
                    )}
                  </div>
                )
              }}
            />
          </div>
        )}
      </Container>
    </div>
  )
}

export default Wallets
