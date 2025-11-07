import type { Meta, StoryObj } from '@storybook/react'
import CallToActionHero from './call-to-action-hero'

const meta: Meta<typeof CallToActionHero> = {
  title: 'Design Library/Molecules/Heroes/CallToActionHero',
  component: CallToActionHero,
  args: {
    title: 'Be part of our community',
    actions: [
      { label: 'Start now', link: '#start', variant: 'contained', color: 'primary', size: 'large' },
      { label: 'Learn more', link: '#learn', variant: 'text', color: 'primary', size: 'large' }
    ]
  },
  parameters: {
    controls: { expanded: true }
  }
}
export default meta

type Story = StoryObj<typeof CallToActionHero>

export const Default: Story = {}

export const Secondary: Story = {
  args: {
    actions: [
      { label: 'Contribute', link: '#contribute', variant: 'contained', color: 'secondary', size: 'large' },
      { label: 'Docs', link: '#docs', variant: 'text', color: 'secondary', size: 'medium' }
    ]
  }
}

export const WithLongTitle: Story = {
  args: {
    title:
      'Join thousands of developers solving issues and getting paid while contributing to open source projects'
  }
}

export const SingleAction: Story = {
  args: {
    actions: [{ label: 'Get Started', link: '#', variant: 'contained', color: 'primary', size: 'large' }]
  }
}
