import type { Meta, StoryObj } from '@storybook/react'
import IssueInviteDialog from './issue-invite-dialog'

type IssueInviteDialogProps = React.ComponentProps<typeof IssueInviteDialog>

const meta: Meta<IssueInviteDialogProps> = {
  title: 'Design Library/Molecules/Dialogs/IssueInviteDialog',
  component: IssueInviteDialog,
  parameters: { layout: 'centered' },
  argTypes: {}
}

export default meta

type Story = StoryObj<IssueInviteDialogProps>

export const Default: Story = {
  args: {
    id: 1,
    visible: true,
    onClose: () => {},
    onInvite: () => {},
    user: {}
  }
}
