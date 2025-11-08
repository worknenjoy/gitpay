import { Meta, StoryObj } from '@storybook/react';
import { withSignupSigninBaseTemplate } from '../../../../../../../.storybook/decorators/withPublicTemplate';
import SigninPage from './signin-page';

const meta: Meta<typeof SigninPage> = {
  title: 'Design Library/Pages/Public/Session/Signin',
  decorators: [ withSignupSigninBaseTemplate ],
  component: SigninPage
};
export default meta;

type Story = StoryObj<typeof SigninPage>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Unable to load session data',
  },
};

export const AlternateSession: Story = {
  args: {
    sessionId: 'another-session-id',
  },
};