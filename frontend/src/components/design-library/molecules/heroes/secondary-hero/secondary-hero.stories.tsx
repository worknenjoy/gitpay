import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import SecondaryHero from './secondary-hero'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import SecurityIcon from '@mui/icons-material/Security'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'

const meta: Meta<typeof SecondaryHero> = {
  title: 'Design Library/Molecules/Heroes/SecondaryHero',
  component: SecondaryHero
}

export default meta
type Story = StoryObj<typeof SecondaryHero>

export const Default: Story = {
  args: {
    image: 'https://placehold.co/800x600?text=Secondary+Hero+Image',
    title: 'Why choose Gitpay?',
    items: [
      {
        icon: <CheckCircleOutlineIcon color="primary" />,
        primaryText: 'Easy setup',
        secondaryText: 'Get started in minutes with minimal configuration.'
      },
      {
        icon: <SecurityIcon color="primary" />,
        primaryText: 'Secure by default',
        secondaryText: 'Built-in best practices to keep your data safe.'
      },
      {
        icon: <SupportAgentIcon color="primary" />,
        primaryText: 'Great support',
        secondaryText: 'We’re here to help whenever you need.'
      }
    ]
  }
}
