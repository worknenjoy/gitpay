import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  Container,
  Typography,
  CardActions,
  CardContent
} from '@mui/material'

// import TaskFilter from '../task/task-filters'
import Taskfilters from '../../../../../containers/task-filter'
import ExploreIssuesTable from './explore-issues-table';

import logoGithub from 'images/github-logo.png'
import logoBitbucket from 'images/bitbucket-logo.png'

import imageGettingStarted from 'images/octodex.png'

import api from '../../../../../consts'
import {
  ExplorePaper,
  Title,
  TopSection,
  FiltersWrapper,
  StyledCard,
  StyledCardMedia,
  GutterLeft,
  ProviderButton
} from './user-explore-tasks.styles'
import IssueFiltersBar from 'design-library/molecules/sections/issue-filter-bar/issue-filter-bar';

const UserTasksExplore = ({ filterTasks, listTasks, tasks, user }) => {

  const baseUrl = '/profile/explore/'

  const getListTasks = async () => {
    await filterTasks({})
    await listTasks({})
  }

  useEffect(() => {
    getListTasks()
  }, [])

  return (
    <ExplorePaper elevation={ 0 }>
      <Container>
        <Title variant="h5" gutterBottom>
          <FormattedMessage id="issues.explore.title" defaultMessage="Explore issues" />
        </Title>
        <Typography variant="caption" gutterBottom>
          <FormattedMessage
            id="issues.explore.description"
            defaultMessage="Here you can see all the issues on our network"
          />
        </Typography>
        <TopSection>
          { !user.id ? (
            <StyledCard>
              <StyledCardMedia src={ imageGettingStarted } />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  <FormattedMessage
                    id="task.user.account.create.headline"
                    defaultMessage="Login / signup to work in our tasks"
                  />
                </Typography>
                <Typography component="p">
                  <FormattedMessage
                    id="task.user.account.create.description"
                    defaultMessage="Creating your account, you can be assigned to a task and receive bounties"
                  />
                </Typography>
              </CardContent>
              <CardActions>
                <ProviderButton
                  href={ `${api.API_URL}/authorize/github` }
                  variant="contained"
                  size="small"
                  color="secondary"
                >
                  <img width="16" src={ logoGithub } />
                  <GutterLeft>Github</GutterLeft>
                </ProviderButton>

                <ProviderButton
                  href={ `${api.API_URL}/authorize/bitbucket` }
                  variant="contained"
                  size="small"
                  color="secondary"
                >
                  <img width="16" src={ logoBitbucket } />
                  <GutterLeft>Bitbucket</GutterLeft>
                </ProviderButton>
              </CardActions>
            </StyledCard>
          ) : (
            <FiltersWrapper>
              <IssueFiltersBar
                filterTasks={ filterTasks }
                listTasks={ listTasks }
                issues={ tasks }
                labels={ [] }
                languages={ [] }
                listLabels={ () => {} }
                listLanguages={ () => {} }
              />
              <ExploreIssuesTable issues={ tasks } />
            </FiltersWrapper>
          ) }
        </TopSection>
      </Container>
    </ExplorePaper>
  )
}

export default UserTasksExplore
