import type { Meta, StoryObj } from '@storybook/react';
import WalletsDashboardCard from './wallets-dashboard-card';

const meta: Meta<typeof WalletsDashboardCard> = {
  title: 'Design Library/Molecules/Cards/DashboardCards/WalletsDashboardCard',
  component: WalletsDashboardCard
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};