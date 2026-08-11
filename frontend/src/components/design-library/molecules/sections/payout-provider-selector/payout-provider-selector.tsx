import React from 'react'
import { Box, Grid, Skeleton, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import PayoutProviderCard from '../../cards/payout-provider-card/payout-provider-card'
import CountryPicker from '../../dialogs/country-picker-dialog/country-picker-dialog'
import EmptyBase from '../../content/empty/empty-base/empty-base'
import { getCountryFlagSrc } from '../../../../areas/private/shared/country-flag'

export type PayoutProviderSelectorProps = {
  /** Whether the current user already has a legacy Stripe connected account */
  hasStripeAccount?: boolean
  /** Whether the current user already has a legacy PayPal account */
  hasPaypalAccount?: boolean
  /** Called with the selected country code to create the Whop account */
  onSaveCountry: (countryCode: string) => Promise<void> | void
  /** Navigate to the existing Stripe tab */
  onAccessStripe?: () => void
  /** Navigate to the existing PayPal tab */
  onAccessPaypal?: () => void
  completed?: boolean
}

/**
 * Payout Settings welcome screen. Renders the three provider cards; only Whop is
 * set-up-able for new users (country picker → create account). Deprecated cards are
 * context-aware: a legacy Stripe/PayPal account shows "Access existing account".
 */
const PayoutProviderSelector = ({
  hasStripeAccount = false,
  hasPaypalAccount = false,
  onSaveCountry,
  onAccessStripe,
  onAccessPaypal,
  completed = true
}: PayoutProviderSelectorProps) => {
  const [openCountryPicker, setOpenCountryPicker] = React.useState(false)
  const [savingCountry, setSavingCountry] = React.useState(false)
  const [country, setCountry] = React.useState<{
    code: string | null
    label: string | null
    image: string | null
  }>({ code: null, label: null, image: null })

  const handleSelectCountry = (item: any) =>
    setCountry({ code: item.code, label: item.label, image: item.image })

  const handleSaveCountry = async () => {
    if (!country.code) return
    setSavingCountry(true)
    await onSaveCountry(country.code)
    setSavingCountry(false)
  }

  if (!completed) {
    return <Skeleton variant="rectangular" width="100%" height={360} />
  }

  // Whop selected → confirm chosen country before creating the account
  if (country.code) {
    return (
      <EmptyBase
        actionText={
          <FormattedMessage
            id="payout.settings.choose.country"
            defaultMessage="Choose country and continue"
          />
        }
        text={country.label}
        onActionClick={handleSaveCountry}
        icon={
          <img width={48} alt={country.label || ''} src={getCountryFlagSrc(country.image || '')} />
        }
        completed={!savingCountry}
      />
    )
  }

  return (
    <Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
        <FormattedMessage
          id="payout-settings.provider.selector.intro"
          defaultMessage="Choose where Gitpay should send the money you earn. You set up identity, bank details and schedule with the provider, and Gitpay keeps the connection."
        />
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
          <PayoutProviderCard
            provider="whop"
            recommended
            title={
              <FormattedMessage
                id="payout-settings.provider.whop.title"
                defaultMessage="Set up your payout on Whop"
              />
            }
            description={
              <FormattedMessage
                id="payout-settings.provider.whop.description"
                defaultMessage="Whop is the payments and payouts platform Gitpay now uses to pay contributors. It handles identity verification, tax forms and the actual transfer to your bank, card or crypto wallet."
              />
            }
            features={[
              <FormattedMessage
                id="payout-settings.provider.whop.feature.countries"
                defaultMessage="Payouts to 100+ countries and 30+ currencies"
              />,
              <FormattedMessage
                id="payout-settings.provider.whop.feature.methods"
                defaultMessage="Bank transfer, debit card or USDC"
              />,
              <FormattedMessage
                id="payout-settings.provider.whop.feature.identity"
                defaultMessage="Identity and tax forms handled on Whop"
              />
            ]}
            actionLabel={
              <FormattedMessage
                id="payout-settings.provider.whop.action"
                defaultMessage="Set up on Whop"
              />
            }
            onAction={() => setOpenCountryPicker(true)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
          <PayoutProviderCard
            provider="stripe"
            deprecated
            hasExistingAccount={hasStripeAccount}
            title={
              <FormattedMessage
                id="payout-settings.provider.stripe.title"
                defaultMessage="Set up your payout on Stripe"
              />
            }
            description={
              <FormattedMessage
                id="payout-settings.provider.stripe.description"
                defaultMessage="Stripe Connect was the previous payout route on Gitpay. New accounts can no longer be created."
              />
            }
            warning={
              <FormattedMessage
                id="payout-settings.provider.stripe.warning"
                defaultMessage="This integration is not available anymore. Existing Stripe accounts keep paying out until they are migrated to Whop."
              />
            }
            actionLabel={
              <FormattedMessage
                id="payout-settings.provider.access-existing"
                defaultMessage="Access existing account"
              />
            }
            unavailableLabel={
              <FormattedMessage
                id="payout-settings.provider.not-available"
                defaultMessage="Not available"
              />
            }
            onAction={onAccessStripe}
            footnote={
              <FormattedMessage
                id="payout-settings.provider.stripe.footnote"
                defaultMessage="Already on Stripe? Support will contact you about migrating."
              />
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
          <PayoutProviderCard
            provider="paypal"
            deprecated
            hasExistingAccount={hasPaypalAccount}
            title={
              <FormattedMessage
                id="payout-settings.provider.paypal.title"
                defaultMessage="Set up your payout on PayPal"
              />
            }
            description={
              <FormattedMessage
                id="payout-settings.provider.paypal.description"
                defaultMessage="PayPal payouts are being discontinued on Gitpay and cannot be connected as a new method."
              />
            }
            warning={
              <FormattedMessage
                id="payout-settings.provider.paypal.warning"
                defaultMessage="PayPal is being discontinued. In a future release you will be able to add PayPal as a payout method inside Whop."
              />
            }
            actionLabel={
              <FormattedMessage
                id="payout-settings.provider.access-existing"
                defaultMessage="Access existing account"
              />
            }
            unavailableLabel={
              <FormattedMessage
                id="payout-settings.provider.not-available"
                defaultMessage="Not available"
              />
            }
            onAction={onAccessPaypal}
            footnote={
              <FormattedMessage
                id="payout-settings.provider.paypal.footnote"
                defaultMessage="Use Whop in the meantime — it covers the same countries."
              />
            }
          />
        </Grid>
      </Grid>

      <CountryPicker
        open={openCountryPicker}
        onClose={() => setOpenCountryPicker(false)}
        onSelectCountry={handleSelectCountry}
      />
    </Box>
  )
}

export default PayoutProviderSelector
