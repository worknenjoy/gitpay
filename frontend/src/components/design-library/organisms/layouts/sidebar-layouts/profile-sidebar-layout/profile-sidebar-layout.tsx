import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
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
  AssignmentTurnedIn as ClaimIcon,
  Receipt as InvoiceSettingsIcon
} from '@mui/icons-material'
import useUserTypes from '../../../../../../hooks/use-user-types'
import { SideMenu } from '../../../../molecules/menus/side-menu/side-menu'

const ProfileSidebar = ({ user }) => {
  const [selected, setSelected] = useState(0)
  const history = useHistory()
  const { isContributor, isMaintainer, isFunding, completed } = useUserTypes({ user })

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
    } else if (path.includes('/profile/invoice-settings')) {
      setSelected(10)
    } else {
      setSelected(0)
    }
  }, [history.location.pathname])

  return (
    <div>
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
                include: isContributor || isMaintainer || isFunding,
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
                include: isContributor || isFunding,
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
                include: isFunding || isMaintainer,
                onClick: () => history.push('/profile/payments'),
                icon: <PaymentIcon />,
                label: (
                  <FormattedMessage id="account.profile.payments.list" defaultMessage="Payments" />
                ),
                selected: selected === 3
              },
              {
                include: isContributor,
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
                include: isFunding || isMaintainer,
                onClick: () => history.push('/profile/wallets'),
                icon: <WalletIcon />,
                label: (
                  <FormattedMessage id="account.profile.wallet.list" defaultMessage="Wallets" />
                ),
                selected: selected === 5
              },
              {
                include: isContributor,
                onClick: () => history.push('/profile/claims'),
                icon: <ClaimIcon />,
                label: (
                  <FormattedMessage id="account.profile.claims.list" defaultMessage="Claims" />
                ),
                selected: selected === 6
              },
              {
                include: isContributor,
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
                include: isContributor,
                onClick: () => history.push('/profile/payout-settings'),
                icon: <PayoutSettingsIcon />,
                label: (
                  <FormattedMessage
                    id="account.profile.payout.settings"
                    defaultMessage="Payout settings"
                  />
                ),
                selected: selected === 9
              },
              {
                include: isFunding || isMaintainer,
                onClick: () => history.push('/profile/invoice-settings'),
                icon: <InvoiceSettingsIcon />,
                label: (
                  <FormattedMessage
                    id="account.profile.invoice.settings"
                    defaultMessage="Invoice settings"
                  />
                ),
                selected: selected === 10
              }
            ]
          }
        ]}
      />
    </div>
  )
}

export default ProfileSidebar
