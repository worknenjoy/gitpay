import React from 'react'
import { FormattedMessage } from 'react-intl'
import SegmentedSwitcher from 'design-library/molecules/switchers/segmented-switcher/segmented-switcher'

export type CombinedDashboardRole = {
  /** e.g. 'contributor' — must be unique across the active roles. */
  key: string
  /** Icon + role name, shown as the switcher tab (e.g. <><CodeIcon/>Contributor</>). */
  tabLabel: React.ReactNode
  /** That role's own, already-built dashboard page (e.g. <ContributorDashboard/>) — it must
   * accept a `switcher` prop, like every dashboard page in this design library does. */
  content: React.ReactElement<{ switcher?: React.ReactNode }>
}

type CombinedDashboardProps = {
  /** Only the roles active on this account. */
  roles: CombinedDashboardRole[]
  /** The multi-role Overview (<DashboardOverview/>) — only used when roles.length > 1. Must
   * accept `switcher` and `onNavigateToRole` props, like <DashboardOverview/> does. */
  overview?: React.ReactElement<{
    switcher?: React.ReactNode
    onNavigateToRole?: (key: string) => void
  }>
}

// The "main render" for an account with more than one role. A single-role
// account sees its role's dashboard directly, unchanged — no switcher at
// all. A multi-role account gets a switcher (Overview + one tab per active
// role); whichever page is selected renders exactly as it does standalone,
// with the switcher injected into its own layout (between its header and
// its banner) rather than wrapped around it, matching where the design
// places it.
const CombinedDashboard = ({ roles, overview }: CombinedDashboardProps) => {
  const [active, setActive] = React.useState('overview')

  if (roles.length <= 1) {
    return roles[0]?.content ?? null
  }

  const switcher = (
    <SegmentedSwitcher
      variant="transparent"
      value={active}
      onChange={setActive}
      options={[
        {
          value: 'overview',
          label: (
            <FormattedMessage id="dashboard.combined.switcher.overview" defaultMessage="Overview" />
          )
        },
        ...roles.map((role) => ({ value: role.key, label: role.tabLabel }))
      ]}
    />
  )

  // Only the Overview needs a way to jump straight to a role's own tab (its
  // "Open X view" links) — a role's own content has no such link.
  if (active === 'overview') {
    return overview ? React.cloneElement(overview, { switcher, onNavigateToRole: setActive }) : null
  }

  const roleContent = roles.find((role) => role.key === active)?.content
  return roleContent ? React.cloneElement(roleContent, { switcher }) : null
}

export default CombinedDashboard
