import type { Meta, StoryObj } from '@storybook/react';
import DashboardCardBase from './dashboard-card-base';

const meta: Meta<typeof DashboardCardBase> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/DashboardCardBase',
  component: DashboardCardBase
};

export default meta;
type Story = StoryObj<typeof DashboardCardBase>;

export const Default: Story = {
  args: {
    title: 'Issues',
    subheader: 'Manage your issues',
    buttonText: 'See your issues',
    buttonLink: '/profile/tasks',
    children: 'content goes here'
  },
};