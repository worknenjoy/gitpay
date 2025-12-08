import type { Meta, StoryObj } from '@storybook/react';
import PaymentRequestsDashboardCard from './payment-requests-dashboard-card';

const meta: Meta<typeof PaymentRequestsDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/PaymentRequestsDashboardCard',
  component: PaymentRequestsDashboardCard
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};