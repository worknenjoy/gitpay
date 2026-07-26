import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Box, Divider, Grid, Paper, Typography, Skeleton } from '@mui/material'
import Button from '../../../../atoms/buttons/button/button'
import ProfileSecondaryHeader from '../../../../molecules/headers/profile-secondary-header/profile-secondary-header'
import AccountHolderStatus from '../../../../atoms/status/account-status/account-holder-status/account-holder-status'
import AccountRequirements from '../../../../atoms/alerts/account-requirements/account-requirements'
import ConfirmButton from 'design-library/atoms/buttons/confirm-button/confirm-button'
import { Field } from '../../../../atoms/inputs/fields/field/field'

type AccountDetailsFormWhopProps = {
  user: any
  account: any
  onConfirmCloseAccount?: () => void
  onCompleteVerification?: () => void
}

const formatMoney = (value: unknown, currency = 'USD') => {
  if (value == null || value === '') return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value)
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: (currency || 'USD').toUpperCase()
    }).format(n)
  } catch {
    return String(n)
  }
}

const formatDate = (value: unknown) => {
  if (!value) return '—'
  try {
    return new Date(String(value)).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return String(value)
  }
}

/**
 * Whop payout account holder view.
 * Identity, bank, and KYC are completed on Whop (account_links), not via Stripe-style fields.
 * Displays connected company data from the Whop API in a read-friendly layout.
 */
const AccountDetailsFormWhop = ({
  user,
  account,
  onConfirmCloseAccount,
  onCompleteVerification
}: AccountDetailsFormWhopProps) => {
  const { data = {}, completed = true } = account || {}
  const {
    id,
    title,
    email,
    country,
    verified,
    route,
    url,
    created_at,
    active,
    capabilities = {},
    balances,
    business_profile = {}
  } = data

  const displayName = title || business_profile?.name || user?.name || user?.email || '—'
  const displayEmail = email || user?.email || '—'
  const displayCountry = country || user?.country || '—'
  const transfersStatus = capabilities?.transfers || (active ? 'active' : 'pending')
  const currency = data?.default_currency || data?.currency || 'usd'

  return (
    <Box>
      <ProfileSecondaryHeader
        title={
          <FormattedMessage
            id="payout-settings.whop.account-holder.title"
            defaultMessage="Whop payout account"
          />
        }
        subtitle={
          <FormattedMessage
            id="payout-settings.whop.account-holder.description"
            defaultMessage="Payout identity and bank details are managed on Whop. Complete verification there, then return here to check your connected company status."
          />
        }
        aside={<AccountHolderStatus status={transfersStatus} completed={completed} />}
      />

      <AccountRequirements
        user={user}
        account={account}
        forceShow
        onClick={onCompleteVerification}
      />

      <Paper variant="outlined" sx={{ p: 3, mt: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          <FormattedMessage
            id="payout-settings.whop.account-holder.company"
            defaultMessage="Connected company"
          />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <FormattedMessage
            id="payout-settings.whop.account-holder.company.hint"
            defaultMessage="This is your Whop connected company under the Gitpay platform. Transfers from payment requests go to this company."
          />
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {!completed ? (
          <Skeleton variant="rectangular" height={160} />
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field
                key={`name-${displayName}`}
                name="whop_company_name"
                label={
                  <FormattedMessage
                    id="payout-settings.whop.field.companyName"
                    defaultMessage="Company name"
                  />
                }
                defaultValue={displayName}
                disabled
                completed={completed}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field
                name="whop_company_id"
                label={
                  <FormattedMessage
                    id="payout-settings.whop.field.companyId"
                    defaultMessage="Company ID"
                  />
                }
                defaultValue={id || '—'}
                disabled
                completed={completed}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field
                name="whop_email"
                label={
                  <FormattedMessage id="payout-settings.whop.field.email" defaultMessage="Email" />
                }
                defaultValue={displayEmail}
                disabled
                completed={completed}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field
                name="whop_country"
                label={
                  <FormattedMessage
                    id="payout-settings.whop.field.country"
                    defaultMessage="Country"
                  />
                }
                defaultValue={String(displayCountry).toUpperCase()}
                disabled
                completed={completed}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field
                name="whop_verified"
                label={
                  <FormattedMessage
                    id="payout-settings.whop.field.verified"
                    defaultMessage="Whop verified"
                  />
                }
                defaultValue={
                  verified === true
                    ? 'Yes'
                    : verified === false
                      ? 'No'
                      : verified == null
                        ? '—'
                        : String(verified)
                }
                disabled
                completed={completed}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Field
                name="whop_created"
                label={
                  <FormattedMessage
                    id="payout-settings.whop.field.created"
                    defaultMessage="Connected since"
                  />
                }
                defaultValue={formatDate(created_at)}
                disabled
                completed={completed}
              />
            </Grid>
            {route ? (
              <Grid size={{ xs: 12, md: 6 }}>
                <Field
                  name="whop_route"
                  label={
                    <FormattedMessage
                      id="payout-settings.whop.field.route"
                      defaultMessage="Whop route"
                    />
                  }
                  defaultValue={route}
                  disabled
                  completed={completed}
                />
              </Grid>
            ) : null}
            {url ? (
              <Grid size={{ xs: 12, md: 6 }}>
                <Field
                  name="whop_url"
                  label={
                    <FormattedMessage
                      id="payout-settings.whop.field.url"
                      defaultMessage="Whop profile"
                    />
                  }
                  defaultValue={url}
                  disabled
                  completed={completed}
                />
              </Grid>
            ) : null}
          </Grid>
        )}
      </Paper>

      {balances && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            <FormattedMessage
              id="payout-settings.whop.account-holder.balances"
              defaultMessage="Company balances (Whop)"
            />
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <FormattedMessage
              id="payout-settings.whop.account-holder.balances.hint"
              defaultMessage="Available funds can be withdrawn. Pending funds are still settling."
            />
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Field
                name="whop_balance_available"
                label={
                  <FormattedMessage
                    id="payout-settings.whop.field.balance.available"
                    defaultMessage="Available"
                  />
                }
                defaultValue={formatMoney(balances.available, currency)}
                disabled
                completed={completed}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Field
                name="whop_balance_pending"
                label={
                  <FormattedMessage
                    id="payout-settings.whop.field.balance.pending"
                    defaultMessage="Pending"
                  />
                }
                defaultValue={formatMoney(balances.pending, currency)}
                disabled
                completed={completed}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Field
                name="whop_balance_reserve"
                label={
                  <FormattedMessage
                    id="payout-settings.whop.field.balance.reserve"
                    defaultMessage="Reserve"
                  />
                }
                defaultValue={formatMoney(balances.reserve, currency)}
                disabled
                completed={completed}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2
        }}
      >
        <ConfirmButton
          variant="outlined"
          color="error"
          label={<FormattedMessage id="account.actions.close" defaultMessage="Close Account" />}
          disabled={false}
          completed={completed}
          dialogMessage={
            <FormattedMessage
              id="payout-settings.whop.close.confirm"
              defaultMessage="Are you sure you want to disconnect your Whop payout account from Gitpay? You can reconnect later by choosing a country again."
            />
          }
          confirmLabel={
            <FormattedMessage id="account.actions.close" defaultMessage="Close Account" />
          }
          cancelLabel={<FormattedMessage id="account.actions.cancel" defaultMessage="Cancel" />}
          alertMessage={
            <FormattedMessage
              id="payout-settings.whop.close.alert"
              defaultMessage="This removes the linked Whop company from Gitpay. Bank and KYC data on Whop are not deleted."
            />
          }
          alertSeverity="warning"
          onConfirm={onConfirmCloseAccount}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'stretch', sm: 'flex-end' },
            gap: 1
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            completed={completed}
            onClick={onCompleteVerification}
            label={
              <FormattedMessage
                id="payout-settings.whop.verification.button"
                defaultMessage="Complete verification on Whop"
              />
            }
          />
          <Typography variant="body2" color="text.secondary" textAlign={{ sm: 'right' }}>
            <FormattedMessage
              id="payout-settings.whop.verification.redirectNote"
              defaultMessage="You'll be redirected to Whop to securely complete identity and payout setup."
            />
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default AccountDetailsFormWhop
