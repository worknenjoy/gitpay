import type { Meta, StoryObj } from '@storybook/react'
import BankAccountsList from './bank-accounts-list'

const meta: Meta<typeof BankAccountsList> = {
  title: 'Design Library/Molecules/Lists/BankAccountsList',
  component: BankAccountsList,
  parameters: {
    layout: 'centered'
  }
}

export default meta

type Story = StoryObj<typeof BankAccountsList>

export const Default: Story = {
  args: {
    accounts: {
      completed: true,
      data: [
        {
          id: 'ba_1',
          bank_name: 'Nubank',
          last4: '1234',
          country: 'BR',
          currency: 'brl',
          status: 'verified',
          account_holder_name: 'Alex Magno',
          default_for_currency: true
        },
        {
          id: 'ba_2',
          bank_name: 'Bank of America',
          last4: '9876',
          country: 'US',
          currency: 'usd',
          status: 'new',
          account_holder_name: 'Alex Magno'
        }
      ]
    },
    onEdit: () => {},
    onDelete: async () => {}
  }
}

export const Empty: Story = {
  args: {
    accounts: {
      completed: true,
      data: []
    },
    onEdit: () => {},
    onDelete: async () => {}
  }
}

export const Loading: Story = {
  args: {
    accounts: {
      completed: false,
      data: []
    },
    onEdit: () => {},
    onDelete: async () => {}
  }
}

export const ErrorState: Story = {
  args: {
    accounts: {
      completed: true,
      data: [],
      error: 'Failed to load'
    },
    onEdit: () => {},
    onDelete: async () => {}
  }
}
