import React, { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import BankAccountsManager from './bank-accounts-manager'
import type { BankAccountListItem } from 'design-library/molecules/lists/bank-accounts-list/bank-accounts-list'

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
  const [accounts, setAccounts] = useState<BankAccountListItem[]>(initialAccounts)

  const nextId = useMemo(() => `ba_${accounts.length + 1}`, [accounts.length])

  const onCreateSubmit = async (e: any) => {
    e.preventDefault()

    // Story-only: create a mock account
    setAccounts((prev) => [
      ...prev,
      {
        id: nextId,
        bank_name: 'New Bank',
        last4: String(1000 + prev.length).slice(-4),
        country: 'US',
        currency: 'usd',
        status: 'new',
        account_holder_name: 'Story User'
      }
    ])
  }

  const onEditSubmit = async (account: BankAccountListItem, e: any) => {
    e.preventDefault()

    // Story-only: mutate name to show change
    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, bank_name: `${a.bank_name} (edited)` } : a))
    )
  }

  const onDelete = async (account: BankAccountListItem) => {
    setAccounts((prev) => prev.filter((a) => a.id !== account.id))
  }

  return (
    <BankAccountsManager
      {...args}
      accounts={accounts}
      user={baseUser}
      countries={baseCountries}
      onChangeBankCode={() => {}}
      onCreateSubmit={onCreateSubmit}
      onEditSubmit={onEditSubmit}
      onDelete={onDelete}
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
