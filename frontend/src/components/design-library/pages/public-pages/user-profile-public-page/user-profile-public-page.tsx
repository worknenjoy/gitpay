import React, { useEffect } from 'react'
import { Container } from '@mui/material'
import { Grid } from '@mui/material'
import ProfileUserHeader from 'design-library/molecules/headers/profile-user-header/profile-user-header'
import { Root } from './user-profile-public-page.styles'
import { Page } from '../../../../../styleguide/components/Page'
import TabbedTable from 'design-library/molecules/tables/tabbed-table/tabbed-table'
import {
  issueMetadata,
  customColumnRenderer,
} from 'design-library/molecules/tables/issue-table/issue-table'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'

const UserProfilePublicPage = ({ user, searchUser, tasks, listTasks, filterTasks }) => {
  const { userId } = useParams<{ userId: string }>()
  const { data: profile } = user || {}

  const listTasksByUserId = async () => {
    await listTasks({ userId: userId })
    await filterTasks('all')
  }

  const filterTasksWithOrders = async () => {
    await listTasks({})
    await filterTasks('supported')
  }

  const filterTasksByState = async (value) => {
    switch (value) {
      case 'created':
        await listTasksByUserId()
        break
      case 'supported':
        await filterTasksWithOrders()
        break
      default:
        await listTasksByUserId()
        break
    }
  }

  const handleTabbedTableChange = (newValue: string) => {
    filterTasksByState(newValue)
  }

  useEffect(() => {
    searchUser({ id: userId })
    listTasksByUserId()
  }, [userId])

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
                onChange={handleTabbedTableChange}
                activeTab={'created'}
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
                      customColumnRenderer: customColumnRenderer,
                    },
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
                      customColumnRenderer: customColumnRenderer,
                    },
                  },
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
