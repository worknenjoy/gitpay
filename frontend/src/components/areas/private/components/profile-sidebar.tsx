import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid, MenuList, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { 
  Home,
  AccountBalanceWallet as WalletIcon,
  LibraryBooks,
  Payment as PaymentIcon,
  AccountBalance as TransferIcon,
  SwapHoriz as PayoutIcon,
  Public as ExploreIcon,
  AccountBox
} from '@material-ui/icons'
import { SideMenu } from '../../../design-library/molecules/menus/side-menu/side-menu'

const ProfileSidebar = ({
  classes,
  user,
  history
}) => {
  const [selected, setSelected] = useState(0)
  const userTypes = user.Types && user.Types.map(t => t.name)

  useEffect(() => {
    const path = history.location.pathname
    if (path.includes('/profile/explore')) {
      setSelected(2)
    } else if (path.includes('/profile/task') || path.includes('/profile/projects') || path.includes('/profile/organizations')) {
      setSelected(1)
    } else if (path.includes('/profile/payments')) {
      setSelected(3)
    } else if(path.includes('/profile/wallets')) {
      setSelected(4)
    } else if(path.includes('/profile/transfers')) {
      setSelected(5)
    } else if(path.includes('/profile/payouts')) {
      setSelected(6)
    } else {
      setSelected(0)
    }
  }, [history.location.pathname])

  return (
    <Grid item xs={ 12 } md={ 2 } spacing={ 0 } className={ classes.sidePaper }>
      <SideMenu
        completed={ user.completed }
        menuItems={
          [
            {
              items: [
                {
                  include: true,
                  onClick: () => history.push('/profile'),
                  icon: <Home />,
                  label: <FormattedMessage id='account.profile.sidemenu.home.link.label' defaultMessage='Dashboard' />,
                  selected: selected === 0
                }
              ]
            },
            {
              category: <FormattedMessage id='account.profile.sidemenu.issues' defaultMessage='Issues' />,
              items: [
                {
                  include: userTypes && (userTypes?.includes('contributor') || userTypes?.includes('maintainer')),
                  onClick: () => history.push('/profile/tasks'),
                  icon: <LibraryBooks />,
                  label: <FormattedMessage id='account.profile.sidemenu.issues.network' defaultMessage='My issues' />,
                  selected: selected === 1
                },
                {
                  include: userTypes && (userTypes?.includes('contributor') || userTypes?.includes('funding')),
                  onClick: () => history.push('/profile/explore'),
                  icon: <ExploreIcon />,
                  label: <FormattedMessage id='account.profile.sidemenu.issues.explore' defaultMessage='Explore issues' />,
                  selected: selected === 2
                }
              ]
            },
            {
              category: <FormattedMessage id='account.profile.sidemenu.section.bounties' defaultMessage='Bounties' />,
              items: [
                {
                  include: userTypes && (userTypes?.includes('funding') || userTypes?.includes('maintainer')),
                  onClick: () => history.push('/profile/payments'),
                  icon: <PaymentIcon />,
                  label: <FormattedMessage id='account.profile.payments.list' defaultMessage='Payments' />,
                  selected: selected === 3
                },
                {
                  include: userTypes && (userTypes?.includes('funding') || userTypes?.includes('maintainer')),
                  onClick: () => history.push('/profile/wallets'),
                  icon: <WalletIcon />,
                  label: <FormattedMessage id='account.profile.wallet.list' defaultMessage='Wallets' />,
                  selected: selected === 4
                },
                {
                  include: userTypes && userTypes?.includes('contributor'),
                  onClick: () => history.push('/profile/transfers'),
                  icon: <TransferIcon />,
                  label: <FormattedMessage id='account.profile.transfer.list' defaultMessage='Transfers' />,
                  selected: selected === 5
                },
                {
                  include: userTypes && userTypes?.includes('contributor'),
                  onClick: () => history.push('/profile/payouts'),
                  icon: <PayoutIcon />,
                  label: <FormattedMessage id='account.profile.payout.list' defaultMessage='Payouts' />,
                  selected: selected === 6
                }
              ]
            },
            {
              category: <FormattedMessage id='account.profile.sidemenu.section.account' defaultMessage='Account' />,
              items: [
                {
                  include: userTypes && (userTypes?.includes('funding') || userTypes?.includes('maintainer')),
                  onClick: () => history.push('/profile/payments'),
                  icon: <AccountBox />,
                  label: <FormattedMessage id='account.profile.account.settings' defaultMessage='Account settings' />,
                  selected: selected === 3
                },
                {
                  include: userTypes && (userTypes?.includes('funding') || userTypes?.includes('maintainer')),
                  onClick: () => history.push('/profile/wallets'),
                  icon: <WalletIcon />,
                  label: <FormattedMessage id='account.profile.payout.settings' defaultMessage='Payout settings' />,
                  selected: selected === 4
                },
                {
                  include: userTypes && userTypes?.includes('maintainer'),
                  onClick: () => history.push('/profile/transfers'),
                  icon: <TransferIcon />,
                  label: <FormattedMessage id='account.profile.billing.info' defaultMessage='Billing information' />,
                  selected: selected === 5
                },
              ]
            }
          ]
        }
      />
    </Grid>
  )
}

export default ProfileSidebar