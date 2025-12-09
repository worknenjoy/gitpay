import type { Meta, StoryObj } from '@storybook/react';
import PayoutsDashboardCard from './payouts-dashboard-card';

const meta: Meta<typeof PayoutsDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/PayoutsDashboardCard',
  component: PayoutsDashboardCard
};

export default meta;
type Story = StoryObj<typeof PayoutsDashboardCard>;

export const Default: Story = {
  args: {
    payouts: {
      currency: 'usd',
      amount: 4500,
      total: 20,
      pending: 5,
      completed: 15,
      in_transit: 5
    }
  },
};