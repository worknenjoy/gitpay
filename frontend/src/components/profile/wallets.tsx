import React, { useState, useEffect } from 'react'
import { defineMessages } from 'react-intl'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import { messages } from '../task/messages/task-messages'
import {
  Container,
  Button,
  Typography
} from '@material-ui/core'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'

import CustomPaginationActionsTable from './wallets-table'
import AddFundsFormDrawer from './components/payments/add-funds-form-drawer'
import BalanceCard from '../design-library/molecules/balance-card/balance-card'

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
  walletOrders
}) => {
  const [addFundsDialog, setAddFundsDialog] = useState(false)
  const [ showWalletName, setShowWalletName ] = useState(false)
  const [ walletName, setWalletName ] = useState('Default wallet')

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
        { wallets.data && wallets.data.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
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
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <div className={classes.paper}>
              <div>
                <Typography variant='body1' gutterBottom>
                  <FormattedMessage id='general.wallets.empty' defaultMessage='No wallets found' />
                </Typography>
                <Button onClick={createWalletName} variant='contained' size='large' color='secondary' className={classes.button}>
                  <FormattedMessage id='general.wallets.create' defaultMessage='Create wallet' />
                </Button>
              </div>
              { showWalletName && (
                <form>
                  <div>
                    <Typography variant='body1' gutterBottom>
                      <FormattedMessage id='general.wallets.name' defaultMessage='Wallet name' />
                    </Typography>
                  </div>
                  <div>
                    <input 
                      type='text'
                      defaultValue={'Default wallet'}
                      onChange={(e) => setWalletName(e.target.value)}
                      value={walletName}
                    />
                    <Button onClick={confirmWalletCreate} variant='contained' size='large' color='secondary' className={classes.button}>
                      <FormattedMessage id='general.wallets.create' defaultMessage='Create wallet' />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        { wallets.data && wallets.data.length > 0 && (
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
                data: walletOrders?.data?.map( wo => [
                  wo.status,
                  `$ ${wo.amount}`,
                  moment(wo.createdAt).format('LLL'),
                  ' '
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
