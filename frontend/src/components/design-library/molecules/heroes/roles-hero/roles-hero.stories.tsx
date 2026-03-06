import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import RolesHero from './roles-hero'
import bountyImage from 'images/roles/bounty.png'
import notificationsImage from 'images/roles/notifications.png'
import paymentCycleImage from 'images/roles/payment-cycle.png'
import sharingImage from 'images/roles/sharing.png'

const meta: Meta<typeof RolesHero> = {
  title: 'Design Library/Molecules/Heroes/RolesHero',
  component: RolesHero,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    cards: { control: 'object' }
  }
}

export default meta
type Story = StoryObj<typeof RolesHero>

export const Default: Story = {
  args: {
    title: 'Choose your role',
    description: 'Pick how you want to use Gitpay and start now.',
    cards: [
      {
        type: 'maintainer',
        title: 'Maintainer',
        description: 'Import issues, manage bounties, and grow your open-source project.',
        image: notificationsImage,
        actionLabel: 'Signup as maintainer',
        onAction: action('signup-maintainer')
      },
      {
        type: 'contributor',
        title: 'Contributor',
        description: 'Solve issues, submit pull requests, and receive payouts for your work.',
        image: bountyImage,
        actionLabel: 'Signup as contributor',
        onAction: action('signup-contributor')
      },
      {
        type: 'sponsor',
        title: 'Sponsor',
        description: 'Fund bounties and accelerate development in projects you care about.',
        image: sharingImage,
        actionLabel: 'Signup as sponsor',
        onAction: action('signup-sponsor')
      },
      {
        type: 'service-provider',
        title: 'Service Provider',
        description: 'Request and receive payments for delivered services through Gitpay.',
        image: paymentCycleImage,
        actionLabel: 'Signup as service provider',
        onAction: action('signup-service-provider')
      }
    ]
  }
}
