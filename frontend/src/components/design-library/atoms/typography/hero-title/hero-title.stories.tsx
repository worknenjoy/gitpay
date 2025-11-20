import type { Meta, StoryObj } from '@storybook/react'
import HeroTitle from './hero-title'

const meta: Meta<typeof HeroTitle> = {
  title: 'Design Library/Atoms/Typography/HeroTitle',
  component: HeroTitle,
  args: {
    children: 'Hero Title'
  }
}

export default meta

type Story = StoryObj<typeof HeroTitle>

export const Default: Story = {}

export const LongText: Story = {
  args: {
    children:
      'This is a very long hero title to demonstrate wrapping and responsiveness across different viewports.'
  }
}
