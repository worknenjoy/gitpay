import React from 'react';
import { 
  Home,
  AccountBalanceWallet as WalletIcon,
  LibraryBooks,
  Payment as PaymentIcon,
} from '@material-ui/icons'
import { SideMenu } from './side-menu';

export default {
  title: 'Design Library/Molecules/Menus/SideMenu',
  component: SideMenu,
};

const Template = (args) => <SideMenu {...args} />;


export const Default = Template.bind({});
Default.args = {
  // Add default props here
  menuItems: [
    {
      category: "Issues",
      items: [
        {
          include: true,
          onClick: () => console.log("My Issues"),
          icon: <LibraryBooks />,
          label: "My Issues",
          selected: true,
        },
        {
          include: true,
          onClick: () => console.log("Explore Issues"),
          icon: <Home />,
          label: "Explore Issues"
        },
      ],
    },
    {
      category: "Wallet",
      items: [
        {
          include: true,
          onClick: () => console.log("My Wallet"),
          icon: <WalletIcon />,
          label: "My Wallet"
        },
        {
          include: true,
          onClick: () => console.log("Payments"),
          icon: <PaymentIcon />,
          label: "Payments"
        },
      ],
    },
  ]
};