import React from 'react'
import { FormattedMessage } from 'react-intl'
import ReceiptIcon from '@mui/icons-material/Receipt'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import PaymentStatus from 'design-library/atoms/status/payment-types-status/payment-status/payment-status'
import ActionField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/action-field/action-field'
import {
  type PaymentRequestPayment,
  PaymentRequestPaymentStatus
} from 'types/payment-request-payment'

export const usePaymentRequestPaymentsCustomColumnRenderer = ({
  onDetails,
  onRefund
}: {
  onDetails?: (item: PaymentRequestPayment) => void
  onRefund?: (id: number) => void | Promise<void>
}) => ({
  status: (item: PaymentRequestPayment) => <PaymentStatus status={item.status as any} />,
  paymentRequestTitle: (item: PaymentRequestPayment) => (
    <TextField title={item.PaymentRequest?.title} />
  ),
  /*
  transferStatus: (item:any) => (
    <TextField title={item.transferStatus} />
  ),
  */
  customer: (item: PaymentRequestPayment) => (
    <TextField title={item.PaymentRequestCustomer?.email} />
  ),
  amount: (item: PaymentRequestPayment) => <AmountField value={item.amount} />,
  createdAt: (item: PaymentRequestPayment) => <CreatedField createdAt={item.createdAt} />,
  actions: (item: PaymentRequestPayment) => (
    <ActionField
      actions={[
        {
          children: <FormattedMessage id="general.buttons.details" defaultMessage="Details" />,
          icon: <VisibilityIcon />,
          onClick: () => {
            if (onDetails) {
              onDetails(item)
            }
          }
        },
        {
          children: <FormattedMessage id="general.buttons.refund" defaultMessage="Refund" />,
          icon: <ReceiptIcon />,
          disabled:
            item.status !== PaymentRequestPaymentStatus.SUCCEEDED &&
            item.status !== PaymentRequestPaymentStatus.PAID,
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
