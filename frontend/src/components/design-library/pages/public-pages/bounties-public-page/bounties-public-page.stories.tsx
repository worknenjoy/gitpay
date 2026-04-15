import type { Meta, StoryObj } from '@storybook/react'
import BountiesPublicPage from './bounties-public-page'

const meta: Meta<typeof BountiesPublicPage> = {
  title: 'Design Library/Pages/Public/BountiesPublicPage',
  component: BountiesPublicPage,
  parameters: {
    layout: 'fullscreen'
  }
}
export default meta

type Story = StoryObj<typeof BountiesPublicPage>

export const Default: Story = {}
