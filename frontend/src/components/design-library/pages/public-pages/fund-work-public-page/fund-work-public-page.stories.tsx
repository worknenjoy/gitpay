import type { Meta, StoryObj } from '@storybook/react'
import FundWorkPublicPage from './fund-work-public-page'

const meta: Meta<typeof FundWorkPublicPage> = {
  title: 'Design Library/Pages/Public/FundWorkPublicPage',
  component: FundWorkPublicPage,
  parameters: {
    layout: 'fullscreen'
  }
}
export default meta

type Story = StoryObj<typeof FundWorkPublicPage>

export const Default: Story = {}
