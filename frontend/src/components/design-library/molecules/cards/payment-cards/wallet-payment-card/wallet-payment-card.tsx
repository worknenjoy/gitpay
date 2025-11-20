import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Skeleton } from '@mui/material'
import { formatCurrency } from '../../../../../../utils/format-currency'
import BalanceCard from 'design-library/molecules/cards/balance-card/balance-card'
import { BtnPayment } from './wallet-payment-card.styles'

function isGreaterThan(a: string | number, b: string | number): boolean {
  const numA = parseFloat(a as string)
  const numB = parseFloat(b as string)

  if (isNaN(numA) || isNaN(numB)) {
    throw new Error('Invalid number input')
  }

  return numA >= numB
}

const WalletPaymentCard = ({
  user,
  task,
  price,
  priceAfterFee,
  createOrder,
  fetchWallet,
  wallet,
  listWallets,
  wallets,
  onClose,
  fetchTask,
  syncTask,
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
      },
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
        {!wallet?.completed ? (
          <Skeleton variant="rectangular" height={150} width="100%" animation="wave" />
        ) : (
          <BalanceCard name={wallet?.data.name} balance={wallet?.data.balance || 0} />
        )}
      </div>
      <BtnPayment
        disabled={
          !price ||
          !wallet?.data?.balance ||
          (wallet?.data?.balance && isGreaterThan(priceAfterFee, wallet?.data?.balance))
        }
        onClick={onWalletPayment}
        variant="contained"
        color="secondary"
      >
        <FormattedMessage
          id="task.payment.wallet.action"
          defaultMessage="Pay {amount} with your Wallet"
          values={{
            amount: formatCurrency(priceAfterFee),
          }}
        />
      </BtnPayment>
    </div>
  )
}

export default WalletPaymentCard
