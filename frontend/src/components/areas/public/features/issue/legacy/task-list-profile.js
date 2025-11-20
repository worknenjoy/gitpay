import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { defineMessages, injectIntl } from 'react-intl'

import { Container, Typography, Tabs, Tab, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

import TopBarContainer from '../../../../../../containers/topbar'
import Bottom from 'design-library/organisms/layouts/bottom-bar-layouts/bottom-bar-layout/bottom-bar-layout'

import { Page, PageContent } from 'app/styleguide/components/Page'

import TaskListContainer from '../../../../../../containers/task-list'

const Root = styled(Grid)({ flexGrow: 1 })

const messages = defineMessages({
  issuesTitle: {
    id: 'task.list.issue.title',
    defaultMessage: 'Explore issues, projects and organizations'
  },
  issuesLabel: {
    id: 'task.list.issue.label',
    defaultMessage: 'Issues'
  },
  projectsLabel: {
    id: 'task.list.issue.projects',
    defaultMessage: 'Projects'
  },
  organizationsLabel: {
    id: 'task.list.issue.organizations',
    defaultMessage: 'Organizations'
  }
})

const TaskListProfile = (props) => {
  const { noTopBar, noBottomBar } = props

  return (
    <Page>
      {!noTopBar && <TopBarContainer />}
      <PageContent>
        <Container fixed maxWidth="lg">
          <Root container>
            <Grid size={{ xs: 12, md: 12 }}>
              <TaskListContainer />
            </Grid>
          </Root>
        </Container>
      </PageContent>
      {!noBottomBar && <Bottom />}
    </Page>
  )
}

TaskListProfile.propTypes = {}

export default injectIntl(TaskListProfile)
