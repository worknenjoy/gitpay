import React from 'react'
import { FormattedMessage } from 'react-intl'
import DetailList from '../../data-display/detail-list/detail-list'
import DetailRow from '../../../atoms/data-display/detail-row/detail-row'
import CountryCurrencyForm from '../../form-section/country-currency-form/country-currency-form'

export type WhopIdentityPanelProps = {
  account?: any
  user?: any
  /** Provider-aware `/user/account/countries` response (same shape used for Stripe) */
  countries?: any
  onManageOnWhop?: () => void
  /** ISO date string of the last sync, if known */
  lastSyncedLabel?: React.ReactNode
}

const identityCheckChip = (status?: string | null) => {
  switch (status) {
    case 'verified':
      return { label: 'VERIFIED', color: 'success' as const }
    case 'unverified':
      return { label: 'UNVERIFIED', color: 'warning' as const }
    default:
      return { label: 'PENDING', color: 'default' as const }
  }
}

/**
 * "Identity & business" read-only panel. Whop verifies documents; Gitpay reads the
 * result. Composes DetailList + DetailRow — not a form.
 */
const WhopIdentityPanel = ({
  account,
  user,
  countries,
  onManageOnWhop,
  lastSyncedLabel
}: WhopIdentityPanelProps) => {
  const { data = {}, completed = true } = account || {}
  const identity = data.identity || {}
  const check = identityCheckChip(identity.identityCheck)

  return (
    <DetailList
      completed={completed}
      title={
        <FormattedMessage
          id="payout-settings.whop.identity.title"
          defaultMessage="Identity & business"
        />
      }
      subtitle={
        <FormattedMessage
          id="payout-settings.whop.identity.subtitle"
          defaultMessage="Who gets paid. Whop verifies this against your documents; Gitpay only reads the result."
        />
      }
      action={
        onManageOnWhop
          ? {
              label: (
                <FormattedMessage
                  id="payout-settings.whop.identity.edit"
                  defaultMessage="Edit identity on Whop"
                />
              ),
              onClick: onManageOnWhop
            }
          : undefined
      }
      footnote={
        lastSyncedLabel || (
          <FormattedMessage id="payout-settings.whop.managed" defaultMessage="Managed on Whop" />
        )
      }
    >
      <CountryCurrencyForm
        country={data.country}
        countries={countries}
        completed={completed}
        excludeCurrency
      />
      <DetailRow
        completed={completed}
        label={
          <FormattedMessage
            id="payout-settings.whop.identity.legalName"
            defaultMessage="Legal name"
          />
        }
        value={identity.legalName || data.title || user?.name}
      />
      <DetailRow
        completed={completed}
        label={<FormattedMessage id="payout-settings.whop.identity.email" defaultMessage="Email" />}
        value={data.email || user?.email}
      />
      <DetailRow
        completed={completed}
        label={
          <FormattedMessage
            id="payout-settings.whop.identity.accountType"
            defaultMessage="Account type"
          />
        }
        value={identity.accountType}
      />
      <DetailRow
        completed={completed}
        label={
          <FormattedMessage
            id="payout-settings.whop.identity.company"
            defaultMessage="Whop company"
          />
        }
        value={data.title}
        hint={data.id}
      />
    </DetailList>
  )
}

export default WhopIdentityPanel
