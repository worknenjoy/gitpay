import React from 'react'
import {
  CreditCard as CreditCardIcon,
  Receipt as InvoiceIcon,
  AccountBalanceWallet as WalletIcon,
  MoneyOff as UnknownPaymentIcon
} from '@mui/icons-material'
import { Chip } from '@mui/material'
import { blue, green, grey, orange } from '@mui/material/colors'
import { paymentProviders, paymentSources } from '../../../../../consts'

import logoPaypal from 'images/paypal-icon.png'

type statusProps = {
  provider: string
  sourceType: string
}

type GetPaymentTypesProps = {
  label?: string
  color?: 'card' | 'invoice' | 'paypal' | 'wallet' | 'unknown'
  icon?: JSX.Element
}
type GetPaymentType = (
  currentPaymentProvider: string,
  currentPaymentSource: string
) => GetPaymentTypesProps

export default function PaymentProvider({ provider, sourceType }: statusProps) {
  const getStatus: GetPaymentType = (
    currentPaymentProvider: string,
    currentPaymentSource: string
  ) => {
    let choosenPayment: GetPaymentTypesProps = {}
    switch (currentPaymentProvider) {
      case paymentProviders.stripe:
        if (currentPaymentSource === paymentSources.invoice) {
          choosenPayment = {
            label: 'Invoice',
            color: 'invoice',
            icon: <InvoiceIcon />
          }
        } else if (currentPaymentSource === paymentSources.card) {
          choosenPayment = {
            label: 'Card',
            color: 'card',
            icon: <CreditCardIcon />
          }
        } else {
          choosenPayment = {
            label: 'Card',
            color: 'card',
            icon: <CreditCardIcon />
          }
        }
        break
      case paymentProviders.paypal:
        choosenPayment = {
          label: 'Paypal',
          color: 'paypal',
          icon: <img src={logoPaypal} width={24} alt="Paypal" />
        }
        break
      case paymentProviders.wallet:
        choosenPayment = {
          label: 'Wallet',
          color: 'wallet',
          icon: <WalletIcon />
        }
        break
      default:
        choosenPayment = {
          label: 'Unknown',
          color: 'unknown',
          icon: <UnknownPaymentIcon />
        }
        break
    }
    return choosenPayment
  }

  const currentPaymentType = getStatus(provider, sourceType)

  const chipSx = (() => {
    switch (currentPaymentType.color) {
      case 'card':
        return { bgcolor: green[400], color: 'common.white' }
      case 'invoice':
        return { bgcolor: orange[600], color: 'common.white' }
      case 'paypal':
        return { bgcolor: blue[300], color: 'common.white' }
      case 'wallet':
        return { bgcolor: grey[500], color: 'common.white' }
      default:
        return { bgcolor: grey[400], color: 'common.white' }
    }
  })()

  return (
    <Chip
      size="small"
      label={currentPaymentType.label}
      icon={currentPaymentType.icon}
      sx={{ ...chipSx, '& .MuiChip-icon': { color: 'common.white' } }}
    />
  )
}
