import React from 'react';
import { 
  Home,
  AccountBalanceWallet as WalletIcon,
  LibraryBooks,
  Payment as PaymentIcon,
  AccountBalance as TransferIcon,
  SwapHoriz as PayoutIcon 
} from '@material-ui/icons'
import { SideMenu } from './side-menu';

export default {
  title: 'Design Library/Molecules/SideMenu',
  component: SideMenu,
};

const Template = (args) => <SideMenu {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Add default props here
  menuItems: [
    {
      include: true,
      onClick: () => console.log('clicked'),
      label: 'Dashboard',
      selected: true,
      icon: <Home />,
    },
    {
      include: true,
      onClick: () => console.log('clicked'),
      label: 'Payments',
      icon: <PaymentIcon />,
    },
  ],
};