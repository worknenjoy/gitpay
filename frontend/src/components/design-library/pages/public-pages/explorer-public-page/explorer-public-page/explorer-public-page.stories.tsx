import type { Meta, StoryObj } from '@storybook/react'
import ExplorerPublicPage from './explorer-public-page'
import { withPublicTemplate } from '../../../../../../../.storybook/decorators/withPublicTemplate'

// If the page relies on routing, contexts, or redux, wrap it in decorators here.

const meta: Meta<typeof ExplorerPublicPage> = {
  title: 'Design Library/Pages/Public/Explorer/Main',
  component: ExplorerPublicPage,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [withPublicTemplate]
}
export default meta

type Story = StoryObj<typeof ExplorerPublicPage>

export const Default: Story = {
  args: {
    // Add prop mocks here if the component expects any
  }
}
