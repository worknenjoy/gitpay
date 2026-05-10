import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { AlertTitle, Box, Divider, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import SecondaryTitle from '../../../../atoms/typography/secondary-title/secondary-title'
import { CustomAlert } from '../../../../atoms/alerts/alert/alert'
import Button from '../../../../atoms/buttons/button/button'
import api from '../../../../../../consts'
import { VerificationStatus } from '../../../../../../types/account'

export const hasPlatformFillableRequirements = (account): boolean =>
  (account?.data?.requirements?.currently_due || []).some(
    (r: string) => api.ACCOUNT_FIELDS_ROUTES?.[r]
  )

export const getVerificationStatus = (account): VerificationStatus => {
  const currentlyDue = account?.data?.requirements?.currently_due || []
  const eventuallyDue = account?.data?.requirements?.eventually_due || []
  if (currentlyDue.length > 0) return 'warning'
  if (eventuallyDue.length > 0) return 'upcoming'
  return 'verified'
}

const formatDeadline = (timestamp: number) => {
  if (!timestamp) return null
  return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const PayoutSettingsBankAccountVerification = ({
  account,
  onCompleteVerification,
  completed = true
}) => {
  const intl = useIntl()
  const currentlyDue = account?.data?.requirements?.currently_due || []
  const eventuallyDue = account?.data?.requirements?.eventually_due || []
  const deadline = formatDeadline(account?.data?.requirements?.current_deadline)
  const status = getVerificationStatus(account)

  const requirementLabel = (requirement: string) => {
    const field = api.ACCOUNT_FIELDS?.[requirement]
    return field
      ? intl.formatMessage(field)
      : intl.formatMessage({ id: 'consts.account.requirement.other', defaultMessage: 'Other' })
  }

  const requirementRoute = (requirement: string): string | undefined =>
    api.ACCOUNT_FIELDS_ROUTES?.[requirement]

  const hasStripeOnlyRequirements = currentlyDue.some((r) => !requirementRoute(r))
  const hasStripeOnlyFutureRequirements = eventuallyDue.some((r) => !requirementRoute(r))

  return (
    <Box>
      <SecondaryTitle
        title={
          <FormattedMessage
            id="payout-settings.verification.title"
            defaultMessage="Additional requirements"
          />
        }
        subtitle={
          <FormattedMessage
            id="payout-settings.verification.subtitle"
            defaultMessage="Keep your account ready to receive payouts."
          />
        }
      />
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        <FormattedMessage id="payout-settings.verification.status" defaultMessage="Status" />
      </Typography>

      {status === 'verified' && (
        <CustomAlert severity="success" completed={completed}>
          <AlertTitle>
            <FormattedMessage
              id="payout-settings.verification.verified.title"
              defaultMessage="Verified · payouts active"
            />
          </AlertTitle>
          <Typography variant="body2">
            <FormattedMessage
              id="payout-settings.verification.verified.description"
              defaultMessage="Your account is fully verified. Payouts will continue on your selected schedule with no action needed from you."
            />
          </Typography>
        </CustomAlert>
      )}

      {status === 'upcoming' && (
        <>
          <CustomAlert severity="info" completed={completed}>
            <AlertTitle>
              <FormattedMessage
                id="payout-settings.verification.upcoming.title"
                defaultMessage="Verified · upcoming requirements"
              />
            </AlertTitle>
            <Typography variant="body2">
              {deadline ? (
                <FormattedMessage
                  id="payout-settings.verification.upcoming.description"
                  defaultMessage="Your account is verified and payouts are active. Stripe will need additional information by {deadline} to keep payouts running uninterrupted."
                  values={{ deadline: <strong>{deadline}</strong> }}
                />
              ) : (
                <FormattedMessage
                  id="payout-settings.verification.upcoming.descriptionNoDate"
                  defaultMessage="Your account is verified and payouts are active. Stripe will need additional information soon to keep payouts running uninterrupted."
                />
              )}
            </Typography>
          </CustomAlert>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
            <FormattedMessage
              id="payout-settings.verification.futureRequirements"
              defaultMessage="Future requirements"
            />
          </Typography>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {eventuallyDue.map((requirement, index) => {
              const route = requirementRoute(requirement)
              return (
                <li key={index}>
                  {route ? (
                    <Link to={route} style={{ textDecoration: 'none' }}>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {requirementLabel(requirement)}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography variant="body2" fontWeight="bold">
                      {requirementLabel(requirement)}
                    </Typography>
                  )}
                  {deadline && (
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage
                        id="payout-settings.verification.dueDate"
                        defaultMessage="Due {date}"
                        values={{ date: deadline }}
                      />
                    </Typography>
                  )}
                </li>
              )
            })}
          </ul>
          {hasStripeOnlyFutureRequirements && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                mt: 4,
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
                    id="payout-settings.verification.provideButton"
                    defaultMessage="Provide information now"
                  />
                }
              />
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage
                  id="payout-settings.verification.redirectNote"
                  defaultMessage="You'll be redirected to Stripe to securely provide the required information."
                />
              </Typography>
            </Box>
          )}
        </>
      )}

      {status === 'warning' && (
        <>
          <CustomAlert severity="warning" completed={completed}>
            <AlertTitle>
              <FormattedMessage
                id="profile.transfer.actionrequired"
                defaultMessage="Action required"
              />
            </AlertTitle>
            <Typography variant="body2">
              <FormattedMessage
                id="profile.transfer.notactive"
                defaultMessage="Stripe needs additional information before payouts can continue for this account."
              />
            </Typography>
          </CustomAlert>
          {currentlyDue.length > 0 && (
            <>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
                <FormattedMessage
                  id="payout-settings.verification.missingInfo"
                  defaultMessage="Missing information"
                />
              </Typography>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {currentlyDue.map((requirement, index) => {
                  const route = requirementRoute(requirement)
                  return (
                    <li key={index}>
                      {route ? (
                        <Link to={route} style={{ textDecoration: 'none' }}>
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {requirementLabel(requirement)}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography variant="body2" fontWeight="bold">
                          {requirementLabel(requirement)}
                        </Typography>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}
          {hasStripeOnlyRequirements && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                mt: 4,
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
                    id="payout-settings.verification.completeButton"
                    defaultMessage="Complete verification"
                  />
                }
              />
              <Typography variant="body2" color="text.secondary">
                <FormattedMessage
                  id="payout-settings.verification.redirectNote"
                  defaultMessage="You'll be redirected to Stripe to securely provide the required information."
                />
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default PayoutSettingsBankAccountVerification
