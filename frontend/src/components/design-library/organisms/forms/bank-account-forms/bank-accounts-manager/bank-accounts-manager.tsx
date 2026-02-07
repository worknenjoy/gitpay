import React from 'react'
import { Stack } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Add as AddIcon } from '@mui/icons-material'

import ProfileSecondaryHeader from 'design-library/molecules/headers/profile-secondary-header/profile-secondary-header'
import EmptyBankAccount from 'design-library/molecules/content/empty/empty-bank-account/empty-bank-account'
import Button from 'design-library/atoms/buttons/button/button'

import BankAccountsList, {
  type BankAccountListItem
} from 'design-library/molecules/lists/bank-accounts-list/bank-accounts-list'
import BankAccountFormDialog from 'design-library/molecules/dialogs/bank-account-form-dialog/bank-account-form-dialog'

type BankAccountsManagerProps = {
  completed?: boolean
  accounts: {
    data: BankAccountListItem[]
    completed?: boolean
    error?: any
  }

  // Used by BankAccountForm
  user: any
  countries: any
  onChangeBankCode?: (bankCode: string) => void

  // Form submit handlers (keep business logic outside design-library)
  onCreateSubmit: (e: any) => void | Promise<void>
  onEditSubmit: (account: BankAccountListItem, e: any) => void | Promise<void>

  // Delete handler
  onDelete?: (account: BankAccountListItem) => void | Promise<void>
}

export default function BankAccountsManager({
  accounts,
  user,
  countries,
  onChangeBankCode,
  onCreateSubmit,
  onEditSubmit,
  onDelete
}: BankAccountsManagerProps) {
  const { data, completed, error } = accounts || {}
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [mode, setMode] = React.useState<'create' | 'edit'>('create')
  const [selected, setSelected] = React.useState<BankAccountListItem | null>(null)

  const openCreate = () => {
    setMode('create')
    setSelected(null)
    setDialogOpen(true)
  }

  const openEdit = (account: BankAccountListItem) => {
    setMode('edit')
    setSelected(account)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  const bankAccountForForm = React.useMemo(() => {
    if (mode === 'edit' && selected) {
      return { completed: true, data: selected, error: {} }
    }
    return { completed: true, data: {}, error: {} }
  }, [mode, selected, accounts])

  const onSubmit = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (mode === 'edit' && selected) {
      await onEditSubmit(selected, e)
    } else {
      await onCreateSubmit(e)
    }
  }

  if (!data || data.length === 0) {
    return (
      <Stack spacing={2}>
        <EmptyBankAccount onActionClick={openCreate} />
        <BankAccountFormDialog
          open={dialogOpen}
          onClose={closeDialog}
          mode={mode}
          user={user}
          countries={countries}
          bankAccount={bankAccountForForm}
          onChangeBankCode={onChangeBankCode}
          onSubmit={onSubmit}
        />
      </Stack>
    )
  }

  return (
    <Stack spacing={2}>
      <ProfileSecondaryHeader
        title={
          <FormattedMessage id="bankAccounts.manager.title" defaultMessage="Bank accounts" />
        }
        subtitle={
          <FormattedMessage
            id="bankAccounts.manager.subtitle"
            defaultMessage="Add, edit, or remove bank accounts used for payouts"
          />
        }
        aside={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon fontSize="small" />}
            label={
              <FormattedMessage id="bankAccounts.manager.add" defaultMessage="Add bank account" />
            }
            completed={completed}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openCreate()
            }}
          />
        }
      />

      <BankAccountsList
        accounts={accounts}
        onEdit={openEdit}
        onDelete={onDelete}
      />

      <BankAccountFormDialog
        open={dialogOpen}
        onClose={closeDialog}
        mode={mode}
        user={user}
        countries={countries}
        bankAccount={bankAccountForForm}
        onChangeBankCode={onChangeBankCode}
        onSubmit={onSubmit}
      />
    </Stack>
  )
}
