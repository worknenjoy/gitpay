import type { Meta, StoryObj } from '@storybook/react';
import PayoutsDashboardCard from './payouts-dashboard-card';

const meta: Meta<typeof PayoutsDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/PayoutsDashboardCard',
  component: PayoutsDashboardCard
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};