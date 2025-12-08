import type { Meta, StoryObj } from '@storybook/react';
import MyIssuesDashboardCard from './my-issues-dashboard-card';

const meta: Meta<typeof MyIssuesDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/MyIssuesDashboardCard',
  component: MyIssuesDashboardCard
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    
  },
};