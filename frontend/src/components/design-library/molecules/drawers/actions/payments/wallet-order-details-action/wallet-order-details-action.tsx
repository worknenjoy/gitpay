import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import DetailsSidePanel, {
  DetailsItem,
  DetailsSection
} from 'design-library/molecules/drawers/details-side-panel/details-side-panel'
import InvoiceStatus from 'design-library/atoms/status/payment-types-status/invoice-status/invoice-status'
import SimpleInfo from 'design-library/atoms/alerts/simple-info/simple-info'
import { formatCurrency } from '../../../../../../../utils/format-currency'

type WalletOrder = {
  id?: number
  amount?: string | number | null
  currency?: string | null
  status?: string
  provider?: string | null
  source?: string | null
  createdAt?: string | Date
}

type Invoice = {
  number?: string | null
  dueDate?: number | null
} | null

type WalletOrderDetailsActionProps = {
  open: boolean
  onClose: () => void
  walletOrder: WalletOrder | null
  invoice?: Invoice
  completed?: boolean
}

const MISSING = <FormattedMessage id="general.messages.missing" defaultMessage="Not found" />

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return null
  return moment(value).format('MMM D, h:mm A')
}

const buildSections = (walletOrder: WalletOrder | null, invoice: Invoice): DetailsSection[] => {
  if (!walletOrder) return []

  const infoItems: DetailsItem[] = [
    {
      label: <FormattedMessage id="wallets.details.status" defaultMessage="Status" />,
      value: walletOrder.status ? <InvoiceStatus status={walletOrder.status} /> : MISSING
    },
    {
      label: <FormattedMessage id="wallets.details.amount" defaultMessage="Amount" />,
      value: walletOrder.amount != null ? formatCurrency(Number(walletOrder.amount)) : MISSING
    },
    {
      label: (
        <FormattedMessage id="wallets.details.invoiceNumber" defaultMessage="Invoice number" />
      ),
      value: invoice?.number ?? MISSING
    },
    {
      label: <FormattedMessage id="wallets.details.dueDate" defaultMessage="Due date" />,
      value: invoice?.dueDate ? formatDateTime(new Date(invoice.dueDate * 1000)) : MISSING
    },
    {
      label: <FormattedMessage id="wallets.details.created" defaultMessage="Created" />,
      value: formatDateTime(walletOrder.createdAt) || MISSING
    }
  ]

  return [
    {
      title: <FormattedMessage id="wallets.details.orderInfo" defaultMessage="Wallet order info" />,
      items: infoItems
    }
  ]
}

const WalletOrderDetailsAction = ({
  open,
  onClose,
  walletOrder,
  invoice = null,
  completed = true
}: WalletOrderDetailsActionProps) => {
  const sections = useMemo(() => buildSections(walletOrder, invoice), [walletOrder, invoice])

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      completed={completed}
      mode="medium"
      title={<FormattedMessage id="wallets.details.title" defaultMessage="Wallet order details" />}
      subtitle={
        <FormattedMessage
          id="wallets.details.subtitle"
          defaultMessage="Breakdown and status for this wallet order"
        />
      }
      banner={
        walletOrder?.provider === 'whop' ? (
          <SimpleInfo
            text={
              <FormattedMessage
                id="wallets.details.whop.managed"
                defaultMessage="This invoice is managed on Whop. There's no downloadable file for it — use Pay invoice to open Whop's checkout, or check payment status directly on Whop."
              />
            }
          />
        ) : null
      }
      sections={sections}
      actions={[
        {
          label: <FormattedMessage id="general.buttons.close" defaultMessage="Close" />,
          onClick: onClose,
          variant: 'contained',
          color: 'secondary'
        }
      ]}
    />
  )
}

export default WalletOrderDetailsAction
