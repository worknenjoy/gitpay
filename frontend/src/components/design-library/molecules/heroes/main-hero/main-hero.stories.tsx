import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import MainHero from './main-hero'
import freelancerImage from 'images/collections/collection-flat-build.svg'

const meta: Meta<typeof MainHero> = {
  title: 'Design Library/Molecules/Heroes/MainHero',
  component: MainHero,
  argTypes: {
    mainTitle: { control: 'text' },
    description: { control: 'text' },
    image: { control: 'text' },
    actions: { control: 'object' },
  },
}

export default meta
type Story = StoryObj<typeof MainHero>

export const Default: Story = {
  args: {
    mainTitle: 'Welcome to Gitpay',
    description: 'Ship work faster with bounties and contributors.',
    image: freelancerImage,
    actions: [
      {
        label: 'Get Started',
        variant: 'contained',
        color: 'primary',
        onClick: action('get-started'),
      },
      {
        label: 'Learn More',
        variant: 'outlined',
        color: 'secondary',
        onClick: action('learn-more'),
      },
    ],
  },
}
