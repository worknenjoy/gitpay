import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import DetailsSidePanel, {
  DetailsItem,
  DetailsSection
} from 'design-library/molecules/drawers/details-side-panel/details-side-panel'
import TransferStatusField from 'design-library/molecules/tables/section-table/section-table-custom-fields/transfer/transfer-status-field/transfer-status-field'
import AccountRequirements from 'design-library/atoms/alerts/account-requirements/account-requirements'
import { validAccount } from '../../../../../../../utils/valid-account'

type Claim = {
  id?: number
  status?: string
  value?: string | number | null
  transfer_method?: string | null
  createdAt?: string | Date
  Task?: { title?: string } | null
  PaymentRequest?: { title?: string } | null
}

type ClaimDetailsActionProps = {
  open: boolean
  onClose: () => void
  claim: Claim | null
  type?: 'bounty' | 'payment-request'
  user?: any
  account?: any
  onActivateAccount?: () => void
  completed?: boolean
}

const MISSING = <FormattedMessage id="general.messages.missing" defaultMessage="Not found" />

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return null
  return moment(value).format('MMM D, h:mm A')
}

const buildSections = (
  claim: Claim | null,
  type: 'bounty' | 'payment-request'
): DetailsSection[] => {
  if (!claim) return []

  const subjectTitle = type === 'payment-request' ? claim.PaymentRequest?.title : claim.Task?.title

  const infoItems: DetailsItem[] = [
    {
      label: <FormattedMessage id="claims.details.status" defaultMessage="Status" />,
      value: claim.status ? <TransferStatusField status={claim.status} /> : MISSING
    },
    {
      label:
        type === 'payment-request' ? (
          <FormattedMessage id="claims.details.paymentRequest" defaultMessage="Payment request" />
        ) : (
          <FormattedMessage id="claims.details.issue" defaultMessage="Issue" />
        ),
      value: subjectTitle || MISSING
    },
    {
      label: <FormattedMessage id="claims.details.method" defaultMessage="Transfer method" />,
      value: claim.transfer_method || MISSING
    },
    {
      label: <FormattedMessage id="claims.details.value" defaultMessage="Value" />,
      value: claim.value && claim.value !== '0' ? `$ ${claim.value}` : MISSING
    },
    {
      label: <FormattedMessage id="claims.details.created" defaultMessage="Created" />,
      value: formatDateTime(claim.createdAt) || MISSING
    }
  ]

  return [
    {
      title: <FormattedMessage id="claims.details.claimInfo" defaultMessage="Claim info" />,
      items: infoItems
    }
  ]
}

const ClaimDetailsAction = ({
  open,
  onClose,
  claim,
  type = 'bounty',
  user,
  account,
  onActivateAccount,
  completed = true
}: ClaimDetailsActionProps) => {
  const sections = useMemo(() => buildSections(claim, type), [claim, type])

  return (
    <DetailsSidePanel
      open={open}
      onClose={onClose}
      completed={completed}
      mode="medium"
      title={<FormattedMessage id="claims.details.title" defaultMessage="Claim details" />}
      subtitle={
        <FormattedMessage
          id="claims.details.subtitle"
          defaultMessage="Breakdown and status for this claim"
        />
      }
      banner={
        !validAccount(user, account) ? (
          <AccountRequirements user={user} account={account} onClick={onActivateAccount} />
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

export default ClaimDetailsAction
