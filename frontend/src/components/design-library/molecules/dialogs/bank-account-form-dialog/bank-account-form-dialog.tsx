import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { FormattedMessage } from 'react-intl'

import BankAccountForm from 'design-library/organisms/forms/bank-account-forms/bank-account-form/bank-account-form'

type BankAccountFormDialogProps = {
  open: boolean
  onClose: () => void
  mode?: 'create' | 'edit'

  // BankAccountForm props
  user: any
  bankAccount: any
  countries: any
  onChangeBankCode?: (bankCode: string) => void
  onSubmit: (e: any) => void | Promise<void>
}

export default function BankAccountFormDialog({
  open,
  onClose,
  mode = 'create',
  user,
  bankAccount,
  countries,
  onChangeBankCode,
  onSubmit
}: BankAccountFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === 'edit' ? (
          <FormattedMessage id="bankAccounts.edit.title" defaultMessage="Edit bank account" />
        ) : (
          <FormattedMessage id="bankAccounts.create.title" defaultMessage="Add bank account" />
        )}
      </DialogTitle>
      <DialogContent>
        <BankAccountForm
          user={user}
          bankAccount={bankAccount}
          countries={countries}
          onChangeBankCode={onChangeBankCode}
          onSubmit={onSubmit}
          submitLabel={
            mode === 'edit' ? (
              <FormattedMessage
                id="bankAccounts.edit.save"
                defaultMessage="Save changes"
              />
            ) : (
              <FormattedMessage id="bankAccounts.create.save" defaultMessage="Add bank account" />
            )
          }
        />
      </DialogContent>
    </Dialog>
  )
}
