import React from 'react'
import { FormattedMessage } from 'react-intl'
import ReceiptIcon from '@mui/icons-material/Receipt'
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import PaymentStatus from 'design-library/atoms/status/payment-types-status/payment-status/payment-status'
import ActionField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/action-field/action-field'

export const usePaymentRequestPaymentsCustomColumnRenderer = ({ onRefund }) => ({
  status: (item: any) => <PaymentStatus status={item.status} />,
  paymentRequestTitle: (item: any) => <TextField title={item.PaymentRequest?.title} />,
  /*
  transferStatus: (item:any) => (
    <TextField title={item.transferStatus} />
  ),
  */
  customer: (item: any) => <TextField title={item.PaymentRequestCustomer?.email} />,
  amount: (item: any) => <AmountField value={item.amount} />,
  createdAt: (item: any) => <CreatedField createdAt={item.createdAt} />,
  actions: (item: any) => (
    <ActionField
      actions={[
        {
          children: <FormattedMessage id="general.buttons.refund" defaultMessage="Refund" />,
          icon: <ReceiptIcon />,
          confirm: {
            dialogMessage: (
              <FormattedMessage
                id="user.profile.payments.refund.confirm"
                defaultMessage="Are you sure you want to refund?"
              />
            ),
            alertMessage: (
              <FormattedMessage
                id="user.profile.payments.refund.message"
                defaultMessage="You will be refunded with the value paid for the issue, excluding fees"
              />
            )
          },
          onClick: async () => {
            if (onRefund) {
              await onRefund(item.id)
            }
          }
        }
      ]}
    />
  )
})
