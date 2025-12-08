import type { Meta, StoryObj } from '@storybook/react';
import PaymentsDashboardCard from './payments-dashboard-card';

const meta: Meta<typeof PaymentsDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/PaymentsDashboardCard',
  component: PaymentsDashboardCard
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};