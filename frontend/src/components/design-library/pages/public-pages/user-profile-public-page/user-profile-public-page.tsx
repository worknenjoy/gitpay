import React, { useEffect } from 'react'
import { Container, Tabs, Tab } from '@mui/material'
import { Grid } from '@mui/material'
import ProfileUserHeader from 'design-library/molecules/headers/profile-user-header/profile-user-header'
import { Root } from './user-profile-public-page.styles'
import { Page } from '../../../../../styleguide/components/Page'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import { issueMetadata, customColumnRenderer } from 'design-library/molecules/tables/issue-table/issue-table'
import { FormattedMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'

const UserProfilePublicPage = ({
  user,
  getUserTypes,
  tasks,
  listTasks,
  filterTasks
}) => {
  const { userId } = useParams<{ userId: string }>()
  const { data: profile } = user || {}

  const listTasksByUserId = () => {
    listTasks({ userId: userId })
    filterTasks('all')
  }

  const filterTasksWithOrders = () => {
    filterTasks('supported')
  }

  function filterTasksByState(value) {
    switch (value) {
      case 'created':
        listTasksByUserId()
        break
      case 'supported':
        filterTasksWithOrders()
        break
      default:
        listTasksByUserId()
        break
    }
  }

  useEffect(() => {
    filterTasksByState('created')
  }, [])

  return (
    <React.Fragment>
      <Page>
        <Container fixed maxWidth='lg'>
          <ProfileUserHeader 
            profile={profile}
            getUserTypes={getUserTypes}
          />
        </Container>
        <Container fixed maxWidth='lg'>
          <Root container>
            <Grid size={{ xs: 12, md: 12 }}>
              <TabbedTable
                activeTab={'created'}
                tabs={[
                  {
                    value: 'created',
                    label: <FormattedMessage id="issues.user.profile.created" defaultMessage="Issues created" />,
                    table: {
                      tableData: tasks,
                      tableHeaderMetadata: issueMetadata,
                      customColumnRenderer: customColumnRenderer
                    }
                  },
                  {
                    value: 'sponsored',
                    label: <FormattedMessage id="issues.user.profile.sponsored" defaultMessage="Issues sponsored" />,
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