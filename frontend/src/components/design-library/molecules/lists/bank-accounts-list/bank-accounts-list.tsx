import React from 'react'
import {
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

import Button from 'design-library/atoms/buttons/button/button'
import ConfirmButton from 'design-library/atoms/buttons/confirm-button/confirm-button'
import BankAccountStatus from 'design-library/atoms/status/account-status/bank-account-status/bank-account-status'
import BankAccountListPlaceholder from './bank-account-list.placeholder'

export type BankAccountListItem = {
  id: string
  bank_name?: string
  last4?: string
  country?: string
  currency?: string
  status?: string
  routing_number?: string
  account_holder_name?: string
  default_for_currency?: boolean
}

type BankAccountsListProps = {
  accounts: {
    data: BankAccountListItem[]
    completed?: boolean
    error?: any
  }
  onEdit?: (account: BankAccountListItem) => void
  onDelete?: (account: BankAccountListItem) => void | Promise<void>
}

const formatAccountMeta = (account: BankAccountListItem) => {
  const pieces: string[] = []
  if (account.country) pieces.push(account.country)
  if (account.currency) pieces.push(account.currency.toUpperCase())
  if (account.last4) pieces.push(`•••• ${account.last4}`)
  return pieces.join(' • ')
}

export default function BankAccountsList({
  accounts,
  onEdit,
  onDelete
}: BankAccountsListProps) {
  const { data = [], completed = false, error } = accounts || {}

  if (!completed) {
    return <BankAccountListPlaceholder />
  }

  if (error.length) {
    return (
      <Card elevation={0} sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={700}>
            <FormattedMessage id="bankAccounts.list.title" defaultMessage="Linked bank accounts" />
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="error">
            <FormattedMessage
              id="bankAccounts.list.error"
              defaultMessage="Failed to load bank accounts."
            />
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card elevation={0} sx={{ width: '100%' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              <FormattedMessage
                id="bankAccounts.list.title"
                defaultMessage="Linked bank accounts"
              />
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <FormattedMessage
                id="bankAccounts.list.count"
                defaultMessage="{count} total"
                values={{ count: 0 }}
              />
            </Typography>
          </Stack>

          <Divider sx={{ mb: 1 }} />

          <Typography variant="body2" color="text.secondary">
            <FormattedMessage
              id="bankAccounts.list.empty"
              defaultMessage="No bank accounts linked yet."
            />
          </Typography>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card elevation={0} sx={{ width: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            <FormattedMessage
              id="bankAccounts.list.title"
              defaultMessage="Linked bank accounts"
            />
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage
              id="bankAccounts.list.count"
              defaultMessage="{count} total"
              values={{ count: data.length }}
            />
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1 }} />

        <List disablePadding>
          {data?.map((account, index) => {
            const title = account.bank_name || (
              <FormattedMessage id="bankAccounts.list.item" defaultMessage="Bank account" />
            )
            const meta = formatAccountMeta(account)

            return (
              <React.Fragment key={account.id}>
                <ListItem
                  sx={{ pr: 18 }}
                  secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button
                        size="small"
                        variant="text"
                        color="secondary"
                        startIcon={<EditIcon fontSize="small" />}
                        label={<FormattedMessage id="common.edit" defaultMessage="Edit" />}
                        completed={completed}
                        onClick={(e) => {
                          e.preventDefault()
                          onEdit?.(account)
                        }}
                      />
                      <ConfirmButton
                        size="small"
                        variant="text"
                        color="error"
                        startIcon={<DeleteIcon fontSize="small" />}
                        label={<FormattedMessage id="common.delete" defaultMessage="Delete" />}
                        completed={completed}
                        dialogMessage={
                          <FormattedMessage
                            id="bankAccounts.delete.confirm"
                            defaultMessage="Delete this bank account?"
                          />
                        }
                        alertSeverity="warning"
                        alertMessage={
                          <FormattedMessage
                            id="bankAccounts.delete.warning"
                            defaultMessage="This action cannot be undone."
                          />
                        }
                        confirmLabel={<FormattedMessage id="common.delete" defaultMessage="Delete" />}
                        cancelLabel={<FormattedMessage id="common.cancel" defaultMessage="Cancel" />}
                        onConfirm={async (e) => {
                          e.preventDefault()
                          await onDelete?.(account)
                        }}
                      />
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={700}>
                          {title}
                        </Typography>
                        <BankAccountStatus
                          status={account.status || 'unknown'}
                          completed={completed}
                        />
                        {account?.default_for_currency ? (
                          <Chip
                            label={
                              <FormattedMessage
                                id="bankAccounts.list.default"
                                defaultMessage="Default for this currency"
                              />
                            }
                            size="small"
                            variant="outlined"

                          />
                        ) : null}
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        {meta ? (
                          <Typography variant="body2" color="text.secondary">
                            {meta}
                          </Typography>
                        ) : null}
                        {account.account_holder_name ? (
                          <Typography variant="caption" color="text.secondary">
                            <FormattedMessage
                              id="bankAccounts.list.holder"
                              defaultMessage="Holder: {name}"
                              values={{ name: account.account_holder_name }}
                            />
                          </Typography>
                        ) : null}
                      </Stack>
                    }
                  />
                </ListItem>
                {index < data.length - 1 ? <Divider /> : null}
              </React.Fragment>
            )
          })}
        </List>
      </CardContent>
    </Card>
  )
}
