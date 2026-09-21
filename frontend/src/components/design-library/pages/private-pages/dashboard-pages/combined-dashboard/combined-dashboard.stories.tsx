import React from 'react'
import CodeIcon from '@mui/icons-material/Code'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LinkIcon from '@mui/icons-material/Link'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { withProfileTemplate } from '../../../../../../../.storybook/decorators/withPrivateTemplate'
import CombinedDashboard from './combined-dashboard'
import DashboardOverview from '../dashboard-overview/dashboard-overview'
import ContributorDashboard from '../contributor-dashboard/contributor-dashboard'
import {
  Default as ContributorDefault,
  Empty as ContributorEmpty
} from '../contributor-dashboard/contributor-dashboard.stories'
import MaintainerDashboard from '../maintainer-dashboard/maintainer-dashboard'
import {
  Default as MaintainerDefault,
  Empty as MaintainerEmpty
} from '../maintainer-dashboard/maintainer-dashboard.stories'
import ServiceProviderDashboard from '../service-provider-dashboard/service-provider-dashboard'
import {
  Default as ProviderDefault,
  Empty as ProviderEmpty
} from '../service-provider-dashboard/service-provider-dashboard.stories'
import FundingDashboard from '../funding-dashboard/funding-dashboard'
import {
  Default as FundingDefault,
  Empty as FundingEmpty
} from '../funding-dashboard/funding-dashboard.stories'
import {
  Default as OverviewDefault,
  Loading as OverviewLoading,
  Empty as OverviewEmpty
} from '../dashboard-overview/dashboard-overview.stories'

const meta = {
  title: 'Design Library/Pages/Private/DashboardPages/CombinedDashboard',
  component: CombinedDashboard,
  decorators: [withProfileTemplate],
  // withProfileTemplate renders the real PrivateBase shell (topbar/sidebar), which reads
  // `user` straight off the story args — every dashboard story sets this for the same reason.
  args: {
    user: { completed: true, data: { id: '1', name: 'John Doe' } }
  }
}

export default meta

const Template = (args) => <CombinedDashboard {...args} />

export const SingleRole = Template.bind({})
SingleRole.args = {
  roles: [
    {
      key: 'contributor',
      tabLabel: (
        <>
          <CodeIcon fontSize="small" /> Contributor
        </>
      ),
      content: <ContributorDashboard {...(ContributorDefault.args as any)} />
    }
  ]
}

export const MultiRoleAllFour = Template.bind({})
MultiRoleAllFour.args = {
  roles: [
    {
      key: 'contributor',
      tabLabel: (
        <>
          <CodeIcon fontSize="small" /> Contributor
        </>
      ),
      content: <ContributorDashboard {...(ContributorDefault.args as any)} />
    },
    {
      key: 'maintainer',
      tabLabel: (
        <>
          <AssignmentIcon fontSize="small" /> Maintainer
        </>
      ),
      content: <MaintainerDashboard {...(MaintainerDefault.args as any)} />
    },
    {
      key: 'provider',
      tabLabel: (
        <>
          <LinkIcon fontSize="small" /> Service provider
        </>
      ),
      content: <ServiceProviderDashboard {...(ProviderDefault.args as any)} />
    },
    {
      key: 'funding',
      tabLabel: (
        <>
          <FavoriteIcon fontSize="small" /> Funding
        </>
      ),
      content: <FundingDashboard {...(FundingDefault.args as any)} />
    }
  ],
  overview: <DashboardOverview {...(OverviewDefault.args as any)} />
}

export const MultiRoleTwoRoles = Template.bind({})
MultiRoleTwoRoles.args = {
  roles: [
    {
      key: 'contributor',
      tabLabel: (
        <>
          <CodeIcon fontSize="small" /> Contributor
        </>
      ),
      content: <ContributorDashboard {...(ContributorDefault.args as any)} />
    },
    {
      key: 'funding',
      tabLabel: (
        <>
          <FavoriteIcon fontSize="small" /> Funding
        </>
      ),
      content: <FundingDashboard {...(FundingDefault.args as any)} />
    }
  ],
  overview: (
    <DashboardOverview
      {...(OverviewDefault.args as any)}
      roleBadges={(OverviewDefault.args as any).roleBadges
        .slice(0, 1)
        .concat((OverviewDefault.args as any).roleBadges.slice(3, 4))}
      roleCount={2}
      roleSections={(OverviewDefault.args as any).roleSections.filter(
        (section: any) => section.key === 'contributor' || section.key === 'funding'
      )}
    />
  )
}

export const Loading = Template.bind({})
Loading.args = {
  roles: MultiRoleAllFour.args.roles,
  overview: <DashboardOverview {...(OverviewLoading.args as any)} />
}

export const Empty = Template.bind({})
Empty.args = {
  roles: [
    {
      key: 'contributor',
      tabLabel: (
        <>
          <CodeIcon fontSize="small" /> Contributor
        </>
      ),
      content: <ContributorDashboard {...(ContributorEmpty.args as any)} />
    },
    {
      key: 'maintainer',
      tabLabel: (
        <>
          <AssignmentIcon fontSize="small" /> Maintainer
        </>
      ),
      content: <MaintainerDashboard {...(MaintainerEmpty.args as any)} />
    },
    {
      key: 'provider',
      tabLabel: (
        <>
          <LinkIcon fontSize="small" /> Service provider
        </>
      ),
      content: <ServiceProviderDashboard {...(ProviderEmpty.args as any)} />
    },
    {
      key: 'funding',
      tabLabel: (
        <>
          <FavoriteIcon fontSize="small" /> Funding
        </>
      ),
      content: <FundingDashboard {...(FundingEmpty.args as any)} />
    }
  ],
  overview: <DashboardOverview {...(OverviewEmpty.args as any)} />
}
