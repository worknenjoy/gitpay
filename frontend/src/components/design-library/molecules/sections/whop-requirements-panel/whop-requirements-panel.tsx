import React from 'react'
import { FormattedMessage } from 'react-intl'
import Checklist, { ChecklistItem } from '../../data-display/checklist/checklist'
import { ChecklistRowStatus } from '../../../atoms/data-display/checklist-row/checklist-row'

export type WhopRequirementsPanelProps = {
  account?: any
  onResolveOnWhop?: () => void
}

/** Copy for each known Whop requirement key. */
const requirementCopy: Record<string, { title: React.ReactNode; description: React.ReactNode }> = {
  identity_document: {
    title: (
      <FormattedMessage
        id="payout-settings.whop.req.identity.title"
        defaultMessage="Identity document"
      />
    ),
    description: (
      <FormattedMessage
        id="payout-settings.whop.req.identity.description"
        defaultMessage="Government-issued ID and a selfie, uploaded on Whop"
      />
    )
  },
  payout_method: {
    title: (
      <FormattedMessage
        id="payout-settings.whop.req.payoutMethod.title"
        defaultMessage="Payout method"
      />
    ),
    description: (
      <FormattedMessage
        id="payout-settings.whop.req.payoutMethod.description"
        defaultMessage="Add a bank account, debit card or USDC wallet on Whop"
      />
    )
  },
  company_profile: {
    title: (
      <FormattedMessage
        id="payout-settings.whop.req.companyProfile.title"
        defaultMessage="Company profile"
      />
    ),
    description: (
      <FormattedMessage
        id="payout-settings.whop.req.companyProfile.description"
        defaultMessage="Name, country and contact email confirmed"
      />
    )
  },
  gitpay_connection: {
    title: (
      <FormattedMessage
        id="payout-settings.whop.req.gitpayConnection.title"
        defaultMessage="Gitpay connection"
      />
    ),
    description: (
      <FormattedMessage
        id="payout-settings.whop.req.gitpayConnection.description"
        defaultMessage="Your Whop company is linked to Gitpay"
      />
    )
  }
}

/**
 * "Requirements & compliance" panel. Renders the normalized checklist from
 * GET /user/account (account.data.requirements.checklist).
 */
const WhopRequirementsPanel = ({ account, onResolveOnWhop }: WhopRequirementsPanelProps) => {
  const { data = {}, completed = true } = account || {}
  const checklist: Array<{ key: string; status: ChecklistRowStatus }> =
    data?.requirements?.checklist || []

  const items: ChecklistItem[] = checklist.map((entry) => ({
    key: entry.key,
    status: entry.status,
    title: requirementCopy[entry.key]?.title || entry.key,
    description: requirementCopy[entry.key]?.description
  }))

  const hasDue = checklist.some((entry) => entry.status === 'required')

  return (
    <Checklist
      completed={completed}
      title={
        <FormattedMessage
          id="payout-settings.whop.requirements.title"
          defaultMessage="Requirements"
        />
      }
      subtitle={
        <FormattedMessage
          id="payout-settings.whop.requirements.subtitle"
          defaultMessage="What Whop still needs from you, and what it has already accepted."
        />
      }
      items={items}
      action={
        hasDue && onResolveOnWhop
          ? {
              label: (
                <FormattedMessage
                  id="payout-settings.whop.requirements.resolve"
                  defaultMessage="Resolve on Whop"
                />
              ),
              onClick: onResolveOnWhop
            }
          : undefined
      }
    />
  )
}

export default WhopRequirementsPanel
