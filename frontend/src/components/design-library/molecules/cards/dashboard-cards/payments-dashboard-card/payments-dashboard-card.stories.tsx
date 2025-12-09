import type { Meta, StoryObj } from '@storybook/react';
import PaymentsDashboardCard from './payments-dashboard-card';

const meta: Meta<typeof PaymentsDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/PaymentsDashboardCard',
  component: PaymentsDashboardCard
};

export default meta;
type Story = StoryObj<typeof PaymentsDashboardCard>;

export const Default: Story = {
  args: {
    payments: {
      total: 210,
      succeeded: 10,
      pending: 150,
      failed: 50,
      amount: 12500
    }
  },
};