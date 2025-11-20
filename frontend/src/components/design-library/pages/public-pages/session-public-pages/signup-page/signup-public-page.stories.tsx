import { Meta, StoryObj } from '@storybook/react'
import { withSignupSigninBaseTemplate } from '../../../../../../../.storybook/decorators/withPublicTemplate'
import SignupPage from './signup-page'

const meta: Meta<typeof SignupPage> = {
  title: 'Design Library/Pages/Public/Session/Signup',
  decorators: [withSignupSigninBaseTemplate],
  component: SignupPage,
}
export default meta

type Story = StoryObj<typeof SignupPage>

export const Default: Story = {
  args: {
    handleSignup: () => {},
    roles: {
      completed: true,
      data: [
        { name: 'contributor', label: 'Contributor' },
        { name: 'maintainer', label: 'Maintainer' },
        { name: 'sponsor', label: 'Sponsor' },
      ],
    },
    fetchRoles: () => {},
  },
}

export const WithError: Story = {
  args: {
    error: 'Unable to load session data',
  },
}

export const AlternateSession: Story = {
  args: {
    sessionId: 'another-session-id',
  },
}
