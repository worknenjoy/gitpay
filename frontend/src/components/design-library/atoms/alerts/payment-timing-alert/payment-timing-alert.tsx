import React from 'react'
import { AlertTitle, Link } from '@mui/material'
import { LockOutlined as LockIcon, History as LaterIcon } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import CustomAlert from 'design-library/atoms/alerts/alert/alert'

export type PaymentTiming = 'advance' | 'later' | 'flex'

type PaymentTimingAlertProps = {
  timing: PaymentTiming
  /** Overrides the default description, e.g. with the paid / pledged split. */
  description?: React.ReactNode
  /** Shows a "Pay later instead" / "Pay now instead" switch (Add bounty drawer). */
  onSwitch?: () => void
}

const SEVERITY: Record<PaymentTiming, 'success' | 'warning' | 'info'> = {
  advance: 'success',
  later: 'warning',
  flex: 'info'
}

const TITLES: Record<PaymentTiming, React.ReactNode> = {
  advance: <FormattedMessage id="paymentTiming.advance.title" defaultMessage="Paid in advance" />,
  later: <FormattedMessage id="paymentTiming.later.title" defaultMessage="Pay later" />,
  flex: <FormattedMessage id="paymentTiming.flex.title" defaultMessage="Flexible" />
}

const DESCRIPTIONS: Record<PaymentTiming, React.ReactNode> = {
  advance: (
    <FormattedMessage
      id="paymentTiming.advance.description"
      defaultMessage="Gitpay holds the funds and releases them when a solution is merged."
    />
  ),
  later: (
    <FormattedMessage
      id="paymentTiming.later.description"
      defaultMessage="Not charged yet. Paid when a solution is accepted."
    />
  ),
  flex: (
    <FormattedMessage
      id="paymentTiming.flex.description"
      defaultMessage="Sponsors can pay now or when a solution is accepted."
    />
  )
}

/** When a bounty is paid: up front (held by Gitpay), later (pledged) or a mix of both. */
const PaymentTimingAlert = ({ timing, description, onSwitch }: PaymentTimingAlertProps) => (
  <CustomAlert
    completed
    severity={SEVERITY[timing]}
    icon={timing === 'advance' ? <LockIcon fontSize="small" /> : <LaterIcon fontSize="small" />}
    elevation={0}
    action={
      onSwitch && (
        <Link component="button" type="button" onClick={onSwitch} sx={{ fontSize: 13, mt: 0.5 }}>
          {timing === 'later' ? (
            <FormattedMessage id="paymentTiming.switch.now" defaultMessage="Pay now instead" />
          ) : (
            <FormattedMessage id="paymentTiming.switch.later" defaultMessage="Pay later instead" />
          )}
        </Link>
      )
    }
  >
    <AlertTitle sx={{ fontSize: 13.5, fontWeight: 500, mb: 0 }}>{TITLES[timing]}</AlertTitle>
    <span style={{ fontSize: 12.5, lineHeight: 1.45 }}>{description || DESCRIPTIONS[timing]}</span>
  </CustomAlert>
)

export default PaymentTimingAlert
