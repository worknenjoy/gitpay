import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from '@mui/material'

import BankAccountFormDialog from './bank-account-form-dialog'

const meta: Meta<typeof BankAccountFormDialog> = {
  title: 'Design Library/Molecules/Dialogs/BankAccountFormDialog',
  component: BankAccountFormDialog
}

export default meta

type Story = StoryObj<typeof BankAccountFormDialog>

const Wrapper = (args: any) => {
  const [open, setOpen] = useState(true)

  return (
    <Stack>
      <BankAccountFormDialog {...args} open={open} onClose={() => setOpen(false)} />
    </Stack>
  )
}

const baseArgs = {
  user: {
    completed: true,
    data: {
      country: 'US'
    }
  },
  countries: {
    completed: true,
    data: {
      default_currency: 'USD',
      supported_bank_account_currencies: {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound Sterling'
      }
    }
  },
  onSubmit: () => {},
  onChangeBankCode: () => {}
}

export const Create: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    ...baseArgs,
    mode: 'create',
    bankAccount: {
      completed: true,
      data: {}
    }
  }
}

export const Edit: Story = {
  render: (args) => <Wrapper {...args} />,
  args: {
    ...baseArgs,
    mode: 'edit',
    bankAccount: {
      completed: true,
      data: {
        id: 'ba_1',
        routing_number: '123456',
        account_number: '123456789',
        account_type: 'individual',
        currency: 'USD'
      }
    }
  }
}
