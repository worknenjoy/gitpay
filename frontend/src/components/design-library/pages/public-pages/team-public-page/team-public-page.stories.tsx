import { Meta, StoryObj } from '@storybook/react'
import Team from './team-public-page'
import { action } from '@storybook/addon-actions'
import { withPublicTemplate } from '../../../../../../.storybook/decorators/withPublicTemplate'

const meta: Meta<typeof Team> = {
  title: 'Design Library/Pages/Public/Team',
  component: Team,
  decorators: [withPublicTemplate]
}

export default meta

type Story = StoryObj<typeof Team>

export const Default: Story = {
  args: {
    joinTeamAPICall: (email: string) => {
      // stub API call
      console.log('joinTeamAPICall invoked with:', email)
      action('joinTeamAPICall')(email)
    }
  }
}
