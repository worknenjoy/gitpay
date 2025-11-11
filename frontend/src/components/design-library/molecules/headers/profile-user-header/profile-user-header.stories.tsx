import type { Meta, StoryObj } from '@storybook/react';
import ProfileUserHeader from './profile-user-header';
import { profile } from 'console';

const meta: Meta<typeof ProfileUserHeader> = {
  title: 'Design Library/Molecules/Headers/ProfileUserHeader',
  component: ProfileUserHeader,
  args: {
    profile: {
      picture_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      username: 'octocat',
      name: 'The Octocat',
      profile_url: 'https://github.com/octocat'
    }
    
  },
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof ProfileUserHeader>;

export const Basic: Story = {};

export const WithLongName: Story = {
  args: {
    profile: {
      picture_url: 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
      username: 'octocat',
      name: 'The Octocat with a Very Long Name to Test Overflow',
      profile_url: 'https://github.com/octocat'
    }
  },
};

export const WithoutAvatar: Story = {
  args: {
    profile: {
      picture_url: '',
      username: 'octocat',
      name: 'The Octocat',
      profile_url: 'https://github.com/octocat',
    }
  },
};