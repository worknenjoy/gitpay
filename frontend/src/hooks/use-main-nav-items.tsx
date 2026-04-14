import React from 'react'
import { FormattedMessage } from 'react-intl'

export type MainNavItem = {
  id: string
  label: React.ReactNode
  path?: string
  topbarPath?: string
  href?: string
  external: boolean
}

const useMainNavItems = (): MainNavItem[] => [
  {
    id: 'about',
    label: <FormattedMessage id="topbar.link.about" defaultMessage="About us" />,
    path: '/welcome',
    external: false
  },
  {
    id: 'pricing',
    label: <FormattedMessage id="topbar.link.prices" defaultMessage="Prices" />,
    path: '/pricing',
    external: false
  },
  {
    id: 'team',
    label: <FormattedMessage id="task.actions.team" defaultMessage="Team" />,
    path: '/team',
    external: false
  },
  {
    id: 'docs',
    label: <FormattedMessage id="task.actions.docs" defaultMessage="Documentation" />,
    href: 'https://docs.gitpay.me/en',
    external: true
  },
  {
    id: 'explore',
    label: <FormattedMessage id="topbar.link.explore" defaultMessage="Explore" />,
    path: '/explore/issues',
    topbarPath: '/tasks/open',
    external: false
  },
  {
    id: 'countries',
    label: <FormattedMessage id="topbar.link.countries" defaultMessage="Countries" />,
    path: '/countries',
    external: false
  }
]

export default useMainNavItems
