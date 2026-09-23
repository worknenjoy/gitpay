import React from 'react'
import { FormattedMessage } from 'react-intl'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TextField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/text-field/text-field'
import AmountField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/amount-field/amount-field'
import CreatedField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/created-field/created-field'
import ActionField from 'design-library/molecules/tables/section-table/section-table-custom-fields/base/action-field/action-field'
import { convertStripeAmountByCurrency } from 'design-library/molecules/cards/balance-card/balance-card'

export const paymentRequestBalancesMetadata = {
  reason: { sortable: true, numeric: false, dataBaseKey: 'reason', label: 'Reason' },
  type: { sortable: true, numeric: false, dataBaseKey: 'type', label: 'Type' },
  amount: { sortable: true, numeric: true, dataBaseKey: 'amount', label: 'Amount' },
  status: { sortable: true, numeric: false, dataBaseKey: 'status', label: 'Status' },
  createdAt: { sortable: true, numeric: false, dataBaseKey: 'createdAt', label: 'Created At' },
  actions: { sortable: false, numeric: false, label: 'Actions' }
}

export const usePaymentRequestBalancesColumnRenderer = ({
  onDetails
}: {
  onDetails?: (item: any) => void
}) => ({
  reason: (item: any) => <TextField title={item?.reason} />,
  type: (item: any) => <TextField title={item?.type} />,
  amount: (item: any) => (
    <AmountField value={convertStripeAmountByCurrency(item?.amount, item?.currency)} />
  ),
  status: (item: any) => <TextField title={item?.status} />,
  createdAt: (item: any) => <CreatedField createdAt={item?.createdAt} />,
  actions: (item: any) => (
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
        }
      ]}
    />
  )
})
