import type { Meta, StoryObj } from '@storybook/react'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import InvoiceSettings from './invoice-settings'

const meta: Meta<typeof InvoiceSettings> = {
  title: 'Design Library/Pages/Private/AccountSettings/InvoiceSettings',
  component: InvoiceSettings,
  decorators: [withProfileTemplate]
}

export default meta

type Story = StoryObj<typeof InvoiceSettings>

export const Default: Story = {
  args: {
    user: {
      completed: true,
      data: {
        id: '1',
        name: 'John Doe',
        Types: [{ name: 'contributor' }, { name: 'maintainer' }, { name: 'funding' }]
      }
    },
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
    },
    customerData: {}
  }
}

export const Loading: Story = {
  args: {
    user: {
      completed: false,
      data: {}
    },
    customer: {
      completed: false,
      data: {}
    },
    customerData: {}
  }
}
