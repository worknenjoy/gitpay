import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Grid } from '@mui/material'
import { useHistory } from 'react-router-dom'
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  LibraryBooks,
  Payment as PaymentIcon,
  CardMembership as PaymentRequestsIcon,
  SwapHoriz as PayoutIcon,
  Public as ExploreIcon,
  AccountBox as AccountIcon,
  AssignmentReturnedTwoTone as PayoutSettingsIcon,
  AssignmentTurnedIn as ClaimIcon
} from '@mui/icons-material'
import { SideMenu } from '../../../../molecules/menus/side-menu/side-menu'

const ProfileSidebar = ({ user }) => {
  const [selected, setSelected] = useState(0)
  const { data, completed } = user
  const userTypes = data?.Types?.map((t) => t.name)
  const history = useHistory()

  useEffect(() => {
    const path = history.location.pathname
    if (path.includes('/profile/explore')) {
      setSelected(2)
    } else if (
      path.includes('/profile/task') ||
      path.includes('/profile/projects') ||
      path.includes('/profile/organizations')
    ) {
      setSelected(1)
    } else if (path.includes('/profile/payments')) {
      setSelected(3)
    } else if (path.includes('/profile/payment-requests')) {
      setSelected(4)
    } else if (path.includes('/profile/wallets')) {
      setSelected(5)
    } else if (path.includes('/profile/claims')) {
      setSelected(6)
    } else if (path.includes('/profile/payouts')) {
      setSelected(7)
    } else if (path.includes('/profile/user-account')) {
      setSelected(8)
    } else if (path.includes('/profile/payout-settings')) {
      setSelected(9)
    } else {
      setSelected(0)
    }
  }, [history.location.pathname])

  return (
    <Grid size={{ xs: 12, md: 2 }}>
      <SideMenu
        completed={completed}
        menuItems={[
          {
            items: [
              {
                include: true,
                onClick: () => history.push('/profile'),
                icon: <DashboardIcon />,
                label: (
                  <FormattedMessage
                    id="account.profile.sidemenu.home.link.label"
                    defaultMessage="Dashboard"
                  />
                ),
                selected: selected === 0
              }
            ]
          },
          {
            category: (
              <FormattedMessage id="account.profile.sidemenu.issues" defaultMessage="Issues" />
            ),
            items: [
              {
                include:
                  (userTypes &&
                    (userTypes?.includes('contributor') || userTypes?.includes('maintainer'))) ||
                  userTypes?.includes('funding'),
                onClick: () => history.push('/profile/tasks'),
                icon: <LibraryBooks />,
                label: (
                  <FormattedMessage
                    id="account.profile.sidemenu.issues.network"
                    defaultMessage="My issues"
                  />
                ),
                selected: selected === 1
              },
              {
                include:
                  userTypes &&
                  (userTypes?.includes('contributor') || userTypes?.includes('funding')),
                onClick: () => history.push('/profile/explore'),
                icon: <ExploreIcon />,
                label: (
                  <FormattedMessage
                    id="account.profile.sidemenu.issues.explore"
                    defaultMessage="Explore issues"
                  />
                ),
                selected: selected === 2
              }
            ]
          },
          {
            category: (
              <FormattedMessage
                id="account.profile.sidemenu.section.bounties"
                defaultMessage="Bounties"
              />
            ),
            items: [
              {
                include:
                  userTypes &&
                  (userTypes?.includes('funding') || userTypes?.includes('maintainer')),
                onClick: () => history.push('/profile/payments'),
                icon: <PaymentIcon />,
                label: (
                  <FormattedMessage id="account.profile.payments.list" defaultMessage="Payments" />
                ),
                selected: selected === 3
              },
              {
                include: userTypes && userTypes?.includes('contributor'),
                onClick: () => history.push('/profile/payment-requests'),
                icon: <PaymentRequestsIcon />,
                label: (
                  <FormattedMessage
                    id="account.profile.paymentRequests.list"
                    defaultMessage="Payment Requests"
                  />
                ),
                selected: selected === 4
              },
              {
                include:
                  userTypes &&
                  (userTypes?.includes('funding') || userTypes?.includes('maintainer')),
                onClick: () => history.push('/profile/wallets'),
                icon: <WalletIcon />,
                label: (
                  <FormattedMessage id="account.profile.wallet.list" defaultMessage="Wallets" />
                ),
                selected: selected === 5
              },
              {
                include: userTypes && userTypes?.includes('contributor'),
                onClick: () => history.push('/profile/claims'),
                icon: <ClaimIcon />,
                label: (
                  <FormattedMessage id="account.profile.claims.list" defaultMessage="Claims" />
                ),
                selected: selected === 6
              },
              {
                include: userTypes && userTypes?.includes('contributor'),
                onClick: () => history.push('/profile/payouts'),
                icon: <PayoutIcon />,
                label: (
                  <FormattedMessage id="account.profile.payout.list" defaultMessage="Payouts" />
                ),
                selected: selected === 7
              }
            ]
          },
          {
            category: (
              <FormattedMessage
                id="account.profile.sidemenu.section.account"
                defaultMessage="Account"
              />
            ),
            items: [
              {
                include: true,
                onClick: () => history.push('/profile/user-account'),
                icon: <AccountIcon />,
                label: (
                  <FormattedMessage
                    id="account.profile.account.settings"
                    defaultMessage="Account settings"
                  />
                ),
                selected: selected === 8
              },
              {
                include: userTypes && userTypes?.includes('contributor'),
                onClick: () => history.push('/profile/payout-settings'),
                icon: <PayoutSettingsIcon />,
                label: (
                  <FormattedMessage
                    id="account.profile.payout.settings"
                    defaultMessage="Payout settings"
                  />
                ),
                selected: selected === 9
              }
            ]
          }
        ]}
      />
    </Grid>
  )
}

export default ProfileSidebar
