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
import ContributorProfileVariant from './variants/contributor/contributor-profile-variant'

// Which role-based variant to render. A user can hold multiple roles at once
// (contributor + maintainer, say) — hence an array — but for now only
// 'contributor' has a real variant; anything else falls back to the generic
// layout below. Test one variant at a time as each is built.
export type ProfileType = 'contributor' | 'maintainer' | 'provider'

type UserProfilePublicPageProps = {
  user?: any
  tasks?: any
  pullRequests?: any
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
  tasks,
  pullRequests,
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

  if (profileTypes.includes('contributor')) {
    return (
      <Page>
        <ContributorProfileVariant
          profile={profile}
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
