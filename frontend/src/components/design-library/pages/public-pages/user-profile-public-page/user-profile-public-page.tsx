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

const UserProfilePublicPage = ({ user, tasks, searchUser, serverSidePagination, onTabChange }) => {
  const { data: profile } = user || {}
  const issueMetadata = useIssueMetadata({ includeProject: true })

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
