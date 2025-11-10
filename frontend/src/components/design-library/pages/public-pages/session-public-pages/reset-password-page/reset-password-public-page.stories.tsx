import { Meta, StoryObj } from '@storybook/react';
import { withSignupSigninBaseTemplate } from '../../../../../../../.storybook/decorators/withPublicTemplate';
import ResetPasswordPage from './reset-password-page';

const meta: Meta<typeof ResetPasswordPage> = {
  title: 'Design Library/Pages/Public/Session/ResetPassword',
  decorators: [ withSignupSigninBaseTemplate ],
  component: ResetPasswordPage
};
export default meta;

type Story = StoryObj<typeof ResetPasswordPage>;

export const Default: Story = {
  args: {
    user: {
      completed: true,
      data: {
        username: 'john_doe',
        email: 'john_doe@example.com'
      }
    }
  }
};

export const Loading: Story = {
  args: {
    user: {
      completed: false,
      data: {}
    }
  }
};

export const WithError: Story = {
  args: {
    error: 'Unable to load session data'
  }
};

export const AlternateSession: Story = {
  args: {
    sessionId: 'another-session-id'
  }
};
