import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { InfoOutlined as InfoIcon } from '@mui/icons-material'
import DetailsSidePanel from 'design-library/molecules/drawers/details-side-panel/details-side-panel'
import BountyPaymentsList, {
  BountyPaymentLine
} from 'design-library/molecules/lists/bounty-payments-list/bounty-payments-list'
import { formatMoney } from 'design-library/molecules/drawers/details-side-panel/details-panel-helpers'
import { Note, PaymentsTitle } from './bounty-breakdown-drawer.styles'

type BountyBreakdownDrawerProps = {
  open: boolean
  onClose: () => void
  payments: BountyPaymentLine[]
  completed?: boolean
}

const sum = (payments: BountyPaymentLine[], state: BountyPaymentLine['state']) =>
  payments.filter((p) => p.state === state).reduce((total, p) => total + p.amount, 0)

/** Every payment that makes up the bounty on an issue, with a summary on top. */
const BountyBreakdownDrawer = ({
  open,
  onClose,
  payments,
  completed = true
}: BountyBreakdownDrawerProps) => {
  const intl = useIntl()
  const paid = sum(payments, 'paid')
  const pledged = sum(payments, 'pledged')
  const pending = sum(payments, 'pending')
  const money = (value: number) => formatMoney(value, 'usd')

  const items = [
    {
      label: <FormattedMessage id="bountyBreakdown.paid" defaultMessage="Paid in advance" />,
      value: money(paid)
    },
    pledged > 0 && {
      label: <FormattedMessage id="bountyBreakdown.pledged" defaultMessage="To pay later" />,
      value: money(pledged)
    },
    pending > 0 && {
      label: <FormattedMessage id="bountyBreakdown.pending" defaultMessage="Invoice pending" />,
      value: money(pending),
      variant: 'muted' as const
    },
    {
      label: <FormattedMessage id="bountyBreakdown.sponsors" defaultMessage="Sponsors" />,
      value: String(payments.length)
    },
    {
      label: <FormattedMessage id="bountyBreakdown.total" defaultMessage="Total bounty" />,
      value: `${money(paid + pledged)} USD`,
      variant: 'emphasis' as const
    }
  ].filter(Boolean) as any[]

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      mode="medium"
      completed={completed}
      title={<FormattedMessage id="bountyBreakdown.title" defaultMessage="Bounty breakdown" />}
      subtitle={
        <FormattedMessage
          id="bountyBreakdown.subtitle"
          defaultMessage="Every payment that makes up the bounty on this issue."
        />
      }
      sections={[
        {
          title: <FormattedMessage id="bountyBreakdown.summary" defaultMessage="Summary" />,
          items
        }
      ]}
      actions={[
        {
          label: intl.formatMessage({ id: 'general.close', defaultMessage: 'Close' }),
          onClick: onClose,
          variant: 'contained',
          color: 'primary'
        }
      ]}
    >
      <PaymentsTitle>
        <FormattedMessage id="bountyBreakdown.payments" defaultMessage="Payments" />
      </PaymentsTitle>
      <BountyPaymentsList payments={payments} />
      <Note>
        <InfoIcon />
        <FormattedMessage
          id="bountyBreakdown.note"
          defaultMessage="Paid amounts are held by Gitpay and released when a solution is merged. Pay later amounts are charged when a solution is accepted."
        />
      </Note>
    </DetailsSidePanel>
  )
}

export default BountyBreakdownDrawer
