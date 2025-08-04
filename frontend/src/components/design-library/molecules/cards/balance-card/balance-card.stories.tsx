import BalanceCard from './balance-card';

const meta = {
  title: 'Design Library/Molecules/Cards/BalanceCard',
  component: BalanceCard,
  args: {
    balance: 1500,
    currency: 'USD',
    name: 'Available Balance',
    completed: true
  }
};

export default meta;

export const Default = {};

export const Loading = {
  completed: false
}