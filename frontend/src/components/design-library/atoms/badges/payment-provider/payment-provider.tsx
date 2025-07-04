import React from 'react';
import { 
  CreditCard as CreditCardIcon,
  Receipt as InvoiceIcon,
  AccountBalanceWallet as WalletIcon,
  MoneyOff as UnknownPaymentIcon
} from '@material-ui/icons';
import  { Chip } from '@material-ui/core';
import { paymentProviders, paymentSources } from '../../../../../consts'

const logoPaypal = require('images/paypal-icon.png').default;

import useStyles from './payment-provider.styles';

type statusProps = {
  provider: string;
  sourceType: string;
}

type GetPaymentTypesProps = { 
  label?: string,
  color?: 'card' | 'invoice' | 'paypal' | 'wallet' | 'unknown',
  icon?: JSX.Element
}
type GetPaymentType = (currentPaymentProvider:string, currentPaymentSource:string) => GetPaymentTypesProps

export default function PaymentProvider({ provider, sourceType }:statusProps) {
  const classes = useStyles();

  const getStatus:GetPaymentType = (currentPaymentProvider:string, currentPaymentSource:string) => {
    let choosenPayment:GetPaymentTypesProps = {};
    switch (currentPaymentProvider) {
      case paymentProviders.stripe:
        if(currentPaymentSource === paymentSources.invoice) {
          choosenPayment = {
            label: 'Invoice',
            color: 'invoice',
            icon: <InvoiceIcon />
          };
        } else
        if(currentPaymentSource === paymentSources.card) {
          choosenPayment = {
            label: 'Card',
            color: 'card',
            icon: <CreditCardIcon />
          };
        } else {
          choosenPayment = {
            label: 'Card',
            color: 'card',
            icon: <CreditCardIcon />
          };
        }
      break;
      case paymentProviders.paypal:
        choosenPayment = {
          label: 'Paypal',
          color: 'paypal',
          icon: <img src={logoPaypal} width={24} alt="Paypal" />
        };
      break;
      case paymentProviders.wallet:
        choosenPayment = {
          label: 'Wallet',
          color: 'wallet',
          icon: <WalletIcon />
        };
      break;
      default:
        choosenPayment = {
          label: 'Unknown',
          color: 'unknown',
          icon: <UnknownPaymentIcon />
        };
      break;
    }
    return choosenPayment;
  }

  const currentPaymentType = getStatus(provider, sourceType);

  return (
    <Chip size="small" label={currentPaymentType.label} className={classes[currentPaymentType.color]} icon={currentPaymentType.icon} />
  );
}
