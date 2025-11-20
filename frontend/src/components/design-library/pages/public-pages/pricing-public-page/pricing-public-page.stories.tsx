import type { Meta, StoryObj } from '@storybook/react'
import PricingPublicPage from './pricing-public-page'

const meta: Meta<typeof PricingPublicPage> = {
  title: 'Design Library/Pages/Public/Pricing',
  component: PricingPublicPage,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof PricingPublicPage>

export const Basic: Story = {
  args: {},
}
