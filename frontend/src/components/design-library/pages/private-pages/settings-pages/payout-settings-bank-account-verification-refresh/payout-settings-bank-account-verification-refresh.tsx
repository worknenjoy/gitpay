import React from 'react'
import { FormattedMessage } from 'react-intl'
import { AlertTitle, Box, Divider, List, ListItem, ListItemText, Typography } from '@mui/material'
import SecondaryTitle from '../../../../atoms/typography/secondary-title/secondary-title'
import { CustomAlert } from '../../../../atoms/alerts/alert/alert'
import Button from '../../../../atoms/buttons/button/button'

const PayoutSettingsBankAccountVerificationRefresh = ({
  onResumeVerification,
  completed = true
}) => {
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

      <CustomAlert severity="warning" completed={completed}>
        <AlertTitle>
          <FormattedMessage
            id="payout-settings.verification.refresh.title"
            defaultMessage="Verification link expired"
          />
        </AlertTitle>
        <Typography variant="body2">
          <FormattedMessage
            id="payout-settings.verification.refresh.description"
            defaultMessage="The secure link you used to continue with Stripe has expired or was interrupted. No information was lost — you can resume from where you left off with a fresh link."
          />
        </Typography>
      </CustomAlert>

      <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
        <FormattedMessage
          id="payout-settings.verification.refresh.whatHappened"
          defaultMessage="What happened"
        />
      </Typography>

      <List disablePadding>
        <ListItem disableGutters alignItems="flex-start" sx={{ pb: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: 'secondary.main',
              mt: '6px',
              mr: 2,
              flexShrink: 0
            }}
          />
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight="bold">
                <FormattedMessage
                  id="payout-settings.verification.refresh.reason1.title"
                  defaultMessage="The Stripe session timed out"
                />
              </Typography>
            }
            secondary={
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage
                  id="payout-settings.verification.refresh.reason1.description"
                  defaultMessage="Verification links are valid for a short period for your security"
                />
              </Typography>
            }
          />
        </ListItem>
        <ListItem disableGutters alignItems="flex-start">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: 'secondary.main',
              mt: '6px',
              mr: 2,
              flexShrink: 0
            }}
          />
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight="bold">
                <FormattedMessage
                  id="payout-settings.verification.refresh.reason2.title"
                  defaultMessage="Your progress is saved"
                />
              </Typography>
            }
            secondary={
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage
                  id="payout-settings.verification.refresh.reason2.description"
                  defaultMessage="Stripe keeps any details you already submitted · just continue where you left off"
                />
              </Typography>
            }
          />
        </ListItem>
      </List>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 4, gap: 1 }}>
        <Button
          variant="contained"
          color="secondary"
          completed={completed}
          onClick={onResumeVerification}
          label={
            <FormattedMessage
              id="payout-settings.verification.refresh.button"
              defaultMessage="Resume verification"
            />
          }
        />
        <Typography variant="body2" color="text.secondary">
          <FormattedMessage
            id="payout-settings.verification.refresh.note"
            defaultMessage="We'll generate a new secure link and redirect you to Stripe."
          />
        </Typography>
      </Box>
    </Box>
  )
}

export default PayoutSettingsBankAccountVerificationRefresh
