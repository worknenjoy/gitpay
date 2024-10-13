import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactPlaceholder from 'react-placeholder'
import { Button } from '@material-ui/core'
import { formatCurrency } from '../../../../../utils/format-currency'
import BalanceCard from '../../../../design-library/molecules/balance-card/balance-card'

const PaymentMethodWalletTab = ({
  classes,
  user,
  task,
  price,
  priceAfterFee,
  plan,
  createOrder,
  fetchWallet,
  wallet,
  listWallets,
  wallets,
  onClose,
  fetchTask,
  syncTask
}) => {

  const onWalletPayment = async () => {
    await createOrder({
      provider: 'wallet',
      amount: price,
      walletId: wallet?.data.id,
      userId: user?.id,
      email: user?.email,
      taskId: task.id,
      currency: 'usd',
      paid: true,
      source_type: 'wallet-funds',
      customer_id: user?.customer_id,
      metadata: {
        user_id: user.id,
      }
    })
    await syncTask(task.id)
    await fetchTask(task.id)
    onClose()
  }

  useEffect(() => {
    const userId = user.id
    userId && listWallets(userId)
  }, [user])

  useEffect(() => {
    const defaultWallet = wallets?.data?.[0]
    defaultWallet && fetchWallet(defaultWallet.id)
  }, [wallets])

  return (
    <div>
      <div className="payment-method-wallet-tab">
        <ReactPlaceholder type='text' ready={wallet?.completed} rows={1} color='#E0E0E0'>
          <BalanceCard
            name={wallet?.data.name}
            balance={wallet?.data.balance}
          />
        </ReactPlaceholder>
      </div>
      <Button
        disabled={!price || price > wallet?.data?.balance}
        onClick={onWalletPayment}
        variant='contained'
        color='secondary'
        className={classes.btnPayment}
      >
        <FormattedMessage id='task.payment.wallet.action' defaultMessage='Pay {amount} with your Wallet' values={{
          amount: formatCurrency(price)
        }} />
      </Button>
    </div>
  );
}

export default PaymentMethodWalletTab;