import React, { useEffect, useState } from 'react'
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
  AssignmentTurnedIn as ClaimIcon
} from '@mui/icons-material'
import useUserTypes from './use-user-types'

const useProfileSidebarMenu = ({ user }) => {
  const [selected, setSelected] = useState(0)
  const history = useHistory()
  const { isContributor, isMaintainer, isFunding, completed } = useUserTypes({ user })

  useEffect(() => {
    const path = history.location.pathname
    if (path === '/profile' || path === '/profile/') {
      setSelected(0)
    } else if (path.includes('/profile/explore')) {
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
    } else {
      setSelected(null)
    }
  }, [history.location.pathname])

  const menuItems = [
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
      category: <FormattedMessage id="account.profile.sidemenu.issues" defaultMessage="Issues" />,
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
      category: (isFunding || isMaintainer) && (
        <FormattedMessage
          id="account.profile.sidemenu.section.payments"
          defaultMessage="Payments"
        />
      ),
      items: [
        {
          include: isFunding || isMaintainer,
          onClick: () => history.push('/profile/payments'),
          icon: <PaymentIcon />,
          label: <FormattedMessage id="account.profile.payments.list" defaultMessage="Payments" />,
          selected: selected === 3
        },
        {
          include: isFunding || isMaintainer,
          onClick: () => history.push('/profile/wallets'),
          icon: <WalletIcon />,
          label: <FormattedMessage id="account.profile.wallet.list" defaultMessage="Wallets" />,
          selected: selected === 5
        }
      ]
    },
    {
      category: isContributor && (
        <FormattedMessage
          id="account.profile.sidemenu.section.paymentrequests"
          defaultMessage="Payment Requests"
        />
      ),
      items: [
        {
          include: isContributor,
          onClick: () => history.push('/profile/payment-requests'),
          icon: <PaymentRequestsIcon />,
          label: (
            <FormattedMessage
              id="account.profile.sidemenu.paymentrequests.paymentrequests"
              defaultMessage="Payment Requests"
            />
          ),
          selected: selected === 4
        }
      ]
    },
    {
      category: isContributor && (
        <FormattedMessage
          id="account.profile.sidemenu.section.receivepayments"
          defaultMessage="Receive Payments"
        />
      ),
      items: [
        {
          include: isContributor,
          onClick: () => history.push('/profile/claims'),
          icon: <ClaimIcon />,
          label: (
            <FormattedMessage
              id="account.profile.sidemenu.contributor.claims"
              defaultMessage="My Claims"
            />
          ),
          selected: selected === 6
        },
        {
          include: isContributor,
          onClick: () => history.push('/profile/payouts'),
          icon: <PayoutIcon />,
          label: (
            <FormattedMessage
              id="account.profile.sidemenu.contributor.payouts"
              defaultMessage="My Payouts"
            />
          ),
          selected: selected === 7
        }
      ]
    }
  ]

  return { completed, menuItems, selected }
}

export default useProfileSidebarMenu
