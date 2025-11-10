import type { Meta, StoryObj } from '@storybook/react';
import CookiePolicy from './cookie-policy';

const meta: Meta<typeof CookiePolicy> = {
  title: 'Design Library/Molecules/Content/Terms/CookiePolicy',
  component: CookiePolicy,
  args: {
    extraStyles: true
  },
  argTypes: {
    extraStyles: { control: 'boolean' }
  }
};
export default meta;

type Story = StoryObj<typeof CookiePolicy>;

export const Default: Story = {
  args: { extraStyles: true }
};

export const NoExtraStyles: Story = {
  args: { extraStyles: false }
};
