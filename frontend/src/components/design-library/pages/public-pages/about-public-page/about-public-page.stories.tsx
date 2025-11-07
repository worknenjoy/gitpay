import type { Meta, StoryObj } from '@storybook/react'
import About from './about-public-page'
import { withPublicTemplate } from '../../../../../../.storybook/decorators/withPublicTemplate';

const meta: Meta<typeof About> = {
  title: 'Design Library/Pages/Public/About',
  component: About,
  decorators: [withPublicTemplate],
  parameters: {
    layout: 'fullscreen'
  }
}

export default meta
type Story = StoryObj<typeof About>

export const Default: Story = {}
