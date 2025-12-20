import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import AccountCustomerForm from './account-customer-form'

const meta: Meta<typeof AccountCustomerForm> = {
  title: 'Design Library/Organisms/Forms/AccountForms/AccountCustomerForm',
  component: AccountCustomerForm
}

export default meta
type Story = StoryObj<typeof AccountCustomerForm>

const baseArgs = {
  user: { data: { id: 123 } },
  fetchCustomer: (id: number) => console.log('fetchCustomer', id),
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('Payment information saved')
  }
}

export const Default: Story = {
  args: {
    ...baseArgs,
    customer: {
      completed: true,
      data: {
        name: 'Acme Inc.',
        address: {
          line1: '123 Main St',
          line2: 'Suite 100',
          postal_code: '90210',
          city: 'Metropolis',
          state: 'CA',
          country: 'US'
        }
      }
    }
  }
}

export const Loading: Story = {
  args: {
    ...baseArgs,
    customer: {
      completed: false,
      data: {
        name: '',
        address: {}
      }
    }
  }
}
