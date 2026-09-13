import React from 'react'
import { Container } from '@mui/material'
import { Grid } from '@mui/material'
import ProfileUserHeader from 'design-library/molecules/headers/profile-user-header/profile-user-header'
import { Root } from './user-profile-public-page.styles'
import { Page } from '../../../../../styleguide/components/Page'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import {
  useIssueMetadata,
  customColumnRenderer
} from 'design-library/molecules/tables/issue-table/issue-table'
import { FormattedMessage } from 'react-intl'
import ContributorProfileVariant, {
  ContributorProfileData
} from './variants/contributor/contributor-profile-variant'
import ServiceProviderProfileVariant, {
  ServiceProviderProfileData
} from './variants/provider/service-provider-profile-variant'
import MaintainerProfileVariant, {
  MaintainerProfileData
} from './variants/maintainer/maintainer-profile-variant'
import CombinedProfileVariant from './variants/combined/combined-profile-variant'

// Which role-based variant to render. A user can hold multiple roles at once
// (contributor + maintainer, say) — hence an array. All three have real
// variants now; holding 2+ renders the combined profile instead of a single one.
export type ProfileType = 'contributor' | 'maintainer' | 'provider'

type UserProfilePublicPageProps = {
  user?: any
  /** Pre-shaped data for the Contributor variant. Required when 2+ roles are
   * active, since `user.data` can then only hold one shape at a time. */
  contributorProfile?: ContributorProfileData
  /** Pre-shaped data for the Maintainer variant — see `contributorProfile`. */
  maintainerProfile?: MaintainerProfileData
  /** Pre-shaped data for the Service Provider variant — see `contributorProfile`. */
  providerProfile?: ServiceProviderProfileData
  tasks?: any
  pullRequests?: any
  /** Maintainer's projects (`{data, completed}`), from `GET /projects/list?userId=`. */
  maintainerProjects?: { data: any[]; completed: boolean }
  /** Open bounties across the maintainer's projects' organization. */
  maintainerOpenBounties?: any
  searchUser?: any
  serverSidePagination?: any
  onTabChange?: any
  profileTypes?: ProfileType[]
  onPayLink?: (link: any) => void
  onViewBounty?: (bounty: any) => void
  onBountyTabChange?: (value: string) => void
  shareUrl?: string
}

const UserProfilePublicPage = ({
  user,
  contributorProfile,
  maintainerProfile,
  providerProfile,
  tasks,
  pullRequests,
  maintainerProjects,
  maintainerOpenBounties,
  searchUser,
  serverSidePagination,
  onTabChange,
  profileTypes = [],
  onPayLink,
  onViewBounty,
  onBountyTabChange,
  shareUrl
}: UserProfilePublicPageProps) => {
  const { data: profile } = user || {}
  const issueMetadata = useIssueMetadata({ includeProject: true })
  const isContributor = profileTypes.includes('contributor')
  const isMaintainer = profileTypes.includes('maintainer')
  const isProvider = profileTypes.includes('provider')
  const activeRoleCount = [isContributor, isMaintainer, isProvider].filter(Boolean).length

  if (activeRoleCount >= 2) {
    return (
      <Page>
        <CombinedProfileVariant
          contributorProfile={contributorProfile}
          maintainerProfile={maintainerProfile}
          providerProfile={providerProfile}
          bounties={tasks}
          pullRequests={pullRequests}
          maintainerProjects={maintainerProjects}
          maintainerOpenBounties={maintainerOpenBounties}
          completed={user?.completed}
          onPayLink={onPayLink}
          onViewBounty={onViewBounty}
          onBountyTabChange={onBountyTabChange}
          shareUrl={shareUrl}
        />
      </Page>
    )
  }

  if (isContributor) {
    return (
      <Page>
        <ContributorProfileVariant
          profile={contributorProfile ?? profile}
          bounties={tasks}
          pullRequests={pullRequests}
          completed={user?.completed}
          onPayLink={onPayLink}
          onViewBounty={onViewBounty}
          onBountyTabChange={onBountyTabChange}
          shareUrl={shareUrl}
        />
      </Page>
    )
  }

  if (isMaintainer) {
    return (
      <Page>
        <MaintainerProfileVariant
          profile={maintainerProfile ?? profile}
          projects={maintainerProjects ?? { data: [], completed: true }}
          openBounties={maintainerOpenBounties ?? { data: [], completed: true }}
          onViewBounty={onViewBounty}
          shareUrl={shareUrl}
        />
      </Page>
    )
  }

  if (isProvider) {
    return (
      <Page>
        <ServiceProviderProfileVariant
          profile={providerProfile ?? profile}
          completed={user?.completed}
          onPayLink={onPayLink}
          shareUrl={shareUrl}
        />
      </Page>
    )
  }

  return (
    <React.Fragment>
      <Page>
        <Container fixed maxWidth="lg">
          <ProfileUserHeader profile={profile} />
        </Container>
        <Container fixed maxWidth="lg">
          <Root container>
            <Grid size={{ xs: 12, md: 12 }}>
              <TabbedTable
                onChange={onTabChange}
                activeTab={'created'}
                serverSidePagination={serverSidePagination}
                tabs={[
                  {
                    value: 'created',
                    label: (
                      <FormattedMessage
                        id="issues.user.profile.created"
                        defaultMessage="Issues created"
                      />
                    ),
                    table: {
                      tableData: tasks,
                      tableHeaderMetadata: issueMetadata,
                      customColumnRenderer: customColumnRenderer
                    }
                  },
                  {
                    value: 'supported',
                    label: (
                      <FormattedMessage
                        id="issues.user.profile.sponsored"
                        defaultMessage="Issues sponsored"
                      />
                    ),
                    table: {
                      tableData: tasks,
                      tableHeaderMetadata: issueMetadata,
                      customColumnRenderer: customColumnRenderer
                    }
                  }
                ]}
              />
            </Grid>
          </Root>
        </Container>
      </Page>
    </React.Fragment>
  )
}
export default UserProfilePublicPage
