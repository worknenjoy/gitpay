import React, { useEffect, useRef, useState } from 'react'
import Drawer from '../drawer/drawer'
import PayoutRequestForm from '../../../organisms/forms/payout-forms/payout-request-form/payout-request-form'

interface PayoutRequestDrawerProps {
  open: boolean
  onClose: () => void
  onSuccess?: (e: any, data: any) => void
  completed?: boolean
  balance?: number
  currency?: string
}

const PayoutRequestDrawer: React.FC<PayoutRequestDrawerProps> = ({
  open,
  onClose,
  onSuccess,
  completed = true,
  balance,
  currency = 'usd'
}) => {
  const formRef = useRef<{ submit: () => void }>(null)
  const [confirmCheck, setConfirmCheck] = useState(false)
  const [amount, setAmount] = useState<number>(0)

  const onConfirmPayoutCheck = (selected: boolean) => {
    setConfirmCheck(selected)
  }

  const onSetAmount = (value) => {
    setAmount(Number(value))
  }

  useEffect(() => {
    console.log('amount', amount)
  }, [amount])

  return (
    <Drawer
      completed={completed}
      open={open}
      onClose={onClose}
      title="Request a new Payout"
      subtitle="Please choose the amount to request a payout to your bank account"
      actions={[
        {
          label: 'Cancel',
          onClick: onClose,
          variant: 'text'
        },
        {
          label: 'Request payout',
          onClick: () => {
            formRef.current?.submit()
          },
          variant: 'contained',
          color: 'secondary',
          disabled: !confirmCheck || !amount || amount <= 0
        }
      ]}
    >
      <PayoutRequestForm
        ref={formRef}
        onSubmit={onSuccess}
        completed={completed}
        balance={balance}
        currency={currency}
        onConfirmPayoutCheck={onConfirmPayoutCheck}
        onSetAmount={onSetAmount}
      />
    </Drawer>
  )
}

export default PayoutRequestDrawer
