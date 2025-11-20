import { Meta, StoryObj } from '@storybook/react'
import { withSignupSigninBaseTemplate } from '../../../../../../../.storybook/decorators/withPublicTemplate'
import ForgotPasswordPage from './forgot-password-page'

const meta: Meta<typeof ForgotPasswordPage> = {
  title: 'Design Library/Pages/Public/Session/ForgotPassword',
  decorators: [withSignupSigninBaseTemplate],
  component: ForgotPasswordPage,
}
export default meta

type Story = StoryObj<typeof ForgotPasswordPage>

export const Default: Story = {}

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
