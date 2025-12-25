import React, { useCallback, useMemo, useRef, useState } from 'react'
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

  const onConfirmPayoutCheck = useCallback((selected: boolean) => {
    setConfirmCheck(selected)
  }, [])

  const onSetAmount = useCallback((value) => {
    setAmount(Number(value))
  }, [])
  
  const shouldDisable = useMemo(() => !confirmCheck || !amount || amount <= 0, [confirmCheck, amount])

  const actions = useMemo(() => {
    return [
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
          disabled: shouldDisable
        }
      ] 
  }, [onClose, shouldDisable])

  return (
    <Drawer
      completed={completed}
      open={open}
      onClose={onClose}
      title="Request a new Payout"
      subtitle="Please choose the amount to request a payout to your bank account"
      actions={actions}
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
