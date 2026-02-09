import React, { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import BankAccountsManager from './bank-accounts-manager'
import type { BankAccountListItem } from 'design-library/molecules/lists/bank-accounts-list/bank-accounts-list'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof BankAccountsManager> = {
  title: 'Design Library/Organisms/Forms/BankAccountForms/BankAccountsManager',
  component: BankAccountsManager
}

export default meta

type Story = StoryObj<typeof BankAccountsManager>

const baseUser = {
  completed: true,
  data: {
    id: 'user_1',
    country: 'US'
  }
}

const baseCountries = {
  completed: true,
  data: {
    default_currency: 'USD',
    supported_bank_account_currencies: {
      USD: 'United States Dollar',
      EUR: 'Euro',
      GBP: 'British Pound Sterling'
    }
  }
}

function StatefulTemplate({ initialAccounts = [] as BankAccountListItem[], ...args }: any) {
  const accounts = {
    id: 'accounts_1',
    bank_name: 'New Bank',
    last4: '123455883723763'.slice(-4),
    country: 'US',
    currency: 'usd',
    status: 'new',
    account_holder_name: 'Story User'
  }

  return (
    <BankAccountsManager
      {...args}
      accounts={accounts}
      user={baseUser}
      countries={baseCountries}
      onChangeBankCode={() => {}}
      onCreateSubmit={(e) => action('Create submit')(e)}
      onEditSubmit={(e) => action('Edit submit')(e)}
      onDelete={(e) => action('Delete')(e)}
    />
  )
}

export const EmptyState: Story = {
  render: (args) => <StatefulTemplate {...args} initialAccounts={[]} />,
  args: {
    completed: true
  }
}

export const WithAccounts: Story = {
  render: (args) =>
    StatefulTemplate({
      ...args,
      initialAccounts: [
        {
          id: 'ba_1',
          bank_name: 'Nubank',
          last4: '1234',
          country: 'BR',
          currency: 'brl',
          status: 'verified',
          account_holder_name: 'Alex'
        },
        {
          id: 'ba_2',
          bank_name: 'Bank of America',
          last4: '9876',
          country: 'US',
          currency: 'usd',
          status: 'new',
          account_holder_name: 'Alex'
        }
      ]
    }),
  args: {
    completed: true
  }
}
